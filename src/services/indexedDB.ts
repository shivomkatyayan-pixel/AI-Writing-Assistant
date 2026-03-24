export class IndexedDBService {
    private dbName = 'AIWritingAssistant';
    private dbVersion = 1;
    private storeName = 'storage';
    private db: IDBDatabase | null = null;

    constructor() {
        this.initDB();
    }

    private async initDB() {
        return new Promise<void>((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onupgradeneeded = (event) => {
                this.db = request.result;
                if (!this.db.objectStoreNames.contains(this.storeName)) {
                    this.db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
                }
            };

            request.onsuccess = (event) => {
                this.db = request.result;
                resolve();
            };

            request.onerror = (event) => {
                reject('Database error: ' + (event.target as IDBRequest).error);
            };
        });
    }

    public async saveNote(note: string) {
        const transaction = this.db!.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.add({ type: 'note', content: note });

        return new Promise<void>((resolve, reject) => {
            request.onsuccess = () => { resolve(); };
            request.onerror = (event) => { reject('Error saving note: ' + (event.target as IDBRequest).error); };
        });
    }

    public async saveEmail(email: string) {
        const transaction = this.db!.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.add({ type: 'email', content: email });

        return new Promise<void>((resolve, reject) => {
            request.onsuccess = () => { resolve(); };
            request.onerror = (event) => { reject('Error saving email: ' + (event.target as IDBRequest).error); };
        });
    }

    public async saveVoiceRecording(blob: Blob) {
        const transaction = this.db!.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.add({ type: 'voice', content: blob });

        return new Promise<void>((resolve, reject) => {
            request.onsuccess = () => { resolve(); };
            request.onerror = (event) => { reject('Error saving voice recording: ' + (event.target as IDBRequest).error); };
        });
    }
}