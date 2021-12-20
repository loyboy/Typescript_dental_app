import {
	BACKUPS_DIR,
	compact,
	DBsList,
	destroyLocal,
	files,
	Message,
	messages,
	modals,
	resync,
	status,
	text
	} from "./";
import { decode, encode, second } from "@utils";
import { saveAs } from "file-saver";
import { Md5 } from "ts-md5";
import { store } from "@utils";
const ext = "txt";

export interface DropboxFile {
	name: string;
	path_lower: string;
	id: string;
	size: number;
	client_modified: string;
}

export interface DatabaseDump {
	dbName: string;
	data: any[];
}

export const backup = {
	toJSON: function() {
		return new Promise(async (resolve, reject) => {
			const PouchDB: PouchDB.Static = ((await import("pouchdb-browser")) as any)
				.default;

			const cryptoPouch: PouchDB.Plugin = ((await import("crypto-pouch")) as any)
				.default;
			PouchDB.plugin(cryptoPouch);
		
			const unique = Md5.hashStr(store.get("LSL_hash")).toString();				

			await compact.compact();

			const dumps: DatabaseDump[] = [];

			let done = 0;

			DBsList.forEach(async dbName => {
				/*const remoteDatabase = new PouchDB(
					`${status.server}/${dbName}`,
					{
						fetch: (url, opts) =>
							PouchDB.fetch(url, {
								...opts,
								credentials: "include"
							})
					}
				);*/
				// prefixing local DB name
				const localName = dbName + "_" + unique;
				const localDatabase = new PouchDB(localName);
				//localDatabase.crypto(unique);
				const data = (await localDatabase.allDocs({
					include_docs: true,
					attachments: true
				})).rows.map(entry => {
					if (entry.doc) {
						delete entry.doc._rev;
					}
					return entry.doc;
				});

				dumps.push({ dbName: localName, data });

				done++;
				return;
			});

			const checkInterval = setInterval(() => {
				if (done === DBsList.length) {
					clearInterval(checkInterval);
					resolve(dumps);
				}
			}, second / 2);
		});
	},

	toBase64: async function() {
		const JSONDump = await backup.toJSON();
		return encode(JSON.stringify(JSONDump));
	},

	toBlob: async function() {
		const base64 = await backup.toBase64();
		return new Blob(["apexo-backup:" + base64], {
			type: "text/plain;charset=utf-8"
		});
	},

	toDropbox: async function(): Promise<string> {
		const blob = await backup.toBlob();
		const path = await files.save(blob, ext, BACKUPS_DIR);
		return path;
	},

	list: async function() {
		return await files.list(BACKUPS_DIR);
	},

	deleteOld: async function(path: string) {
		return await files.remove(path);
	}
};

export const restore = {
	fromJSON: async function(json: DatabaseDump[]) {
		return new Promise(async (resolve, reject) => {
			const PouchDB: PouchDB.Static = ((await import("pouchdb-browser")) as any).default;
			//const cryptoPouch: PouchDB.Plugin = ((await import("crypto-pouch")) as any).default;
			//PouchDB.plugin(cryptoPouch);
		
			//const unique = Md5.hashStr(store.get("LSL_hash")).toString();	

			status.resetUser();
			let done = 0;
			console.log(" Restore 1...");

			json.forEach(async dump => {
				const dbName = dump.dbName;
				
				const localDatabase2 = new PouchDB(dbName);
			
				console.log(" Restore 2...");
				/*const remoteDatabase1 = new PouchDB(
					`${status.server}/${dbName}`,
					{
						fetch: (url, opts) =>
							PouchDB.fetch(url, {
								...opts,
								credentials: "include"
							})
					}
				);*/
				//await remoteDatabase1.destroy();
				await localDatabase2.destroy();
				/*const remoteDatabase2 = new PouchDB(
					`${status.server}/${dbName}`,
					{
						fetch: (url, opts) =>
							PouchDB.fetch(url, {
								...opts,
								credentials: "include"
							})
					}
				);*/
				console.log(" Restore 3...");
				const localDatabase3 = new PouchDB(dbName);
				
				const a = await localDatabase3.bulkDocs(dump.data);
				done++;
				return;
			});

			const checkInterval = setInterval(async () => {
				if (done === json.length) {
					clearInterval(checkInterval);
				//	await destroyLocal.destroy();
				//	await resync.resync();
					location.reload();
				}
			}, second / 100);
		});
	},

	fromBase64: async function(base64Data: string, ignoreConfirm?: boolean) {
		return new Promise(async (resolve, reject) => {
			if (ignoreConfirm) {
				const json = JSON.parse(base64Data);
				await restore.fromJSON(json);
				resolve();
			} else {
				modals.newModal({
					message: text(
						`All unsaved data will be lost. All data will be removed and replaced by the backup file. Type "yes" to confirm`
					),
					onConfirm: async (input: string) => {
						if (input.toLowerCase() === "yes") {
							const json = JSON.parse(base64Data);
							await restore.fromJSON(json);
							resolve();
						} else {
							const msg = new Message(
								text("Restoration cancelled")
							);
							messages.addMessage(msg);
							return reject();
						}
					},
					input: true,
					showCancelButton: false,
					showConfirmButton: true,
					id: Math.random()
				});
			}
		});
	},

	fromFile: async function(file: Blob) {
		return new Promise((resolve, reject) => {
			function terminate() {
				const msg = new Message(text("Invalid file"));
				messages.addMessage(msg);
				return reject();
			}
			const reader = new FileReader();
			reader.readAsText(file);
			reader.onloadend = async function() {
				const base64data = reader.result;
				//console.log( "base64ddaataa:  "+ base64data )
				if (typeof base64data === "string") { 
					await restore.fromBase64(base64data);
					resolve();
					/*const fileData = atob(base64data.split("base64,")[1]).split(
						"apexo-backup:"
					)[1];
					if (fileData) {
						await restore.fromBase64(fileData);
						resolve();
					}
					
					else {
						console.log(" Base64data now: "+ base64data )
						await restore.fromJSON(JSON.parse(base64data));
						resolve();
					} **/
				} else {
					terminate();
				}
			};
		});
	},

	fromDropbox: async function(filePath: string) {
		const base64File = (await files.get(filePath)).split(";base64,")[1];
		const base64Data = decode(base64File).split("apexo-backup:")[1];
		this.fromBase64(base64Data);
	}
};

export async function downloadCurrent() {
	//const blob = await backup.toBlob();
	const databackup = await backup.toJSON();
	return new Promise(resolve => {
		modals.newModal({
			id: Math.random(),
			message: text("Please enter file name"),
			onConfirm: fileName => {
				var blob = new Blob([JSON.stringify(databackup)], {
					type: "text/plain;charset=utf-8"
				});
				saveAs(blob, `${fileName || "apexo-backup"}.${ext}`);
				resolve();
			},
			input: true,
			showCancelButton: true,
			showConfirmButton: true
		});
	});
}
