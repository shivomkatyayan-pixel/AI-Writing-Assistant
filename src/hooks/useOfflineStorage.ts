import { useEffect, useState } from 'react';

const useOfflineStorage = (key) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const db = await openDB('my-database', 1, {
                upgrade(db) {
                    db.createObjectStore('keyval');
                },
            });

            const storedData = await db.get('keyval', key);
            setData(storedData);
        };

        const syncData = async () => {
            const db = await openDB('my-database', 1);
            db.put('keyval', data, key);
        };

        fetchData();

        window.addEventListener('beforeunload', syncData);
        return () => {
            window.removeEventListener('beforeunload', syncData);
        };
    }, [key, data]);

    return [data, setData];
};

export default useOfflineStorage;
