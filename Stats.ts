import { type Processed } from "./helpers/ProcessRequest.js";
import ProcessRequest from "./helpers/ProcessRequest.js";
import Table from "./helpers/Table.js";
import fs from "fs/promises";
import path from "path";

interface CachedFile extends Processed{
    Timestamp: number;
}

const IsTodayUTC = (Timestamp: number): boolean => {
    const Now: Date = new Date();
    const TS: Date = new Date(Timestamp);
    return (
        Now.getUTCDate() === TS.getUTCDate() &&
        Now.getUTCMonth() === TS.getUTCMonth() &&
        Now.getUTCFullYear() === TS.getUTCFullYear()
    );
};

const Stats = async (): Promise<Table> => {
    let Processed: CachedFile;
    const CachedDir: string = path.join(import.meta.dirname, "cached");
    const CachedPath: string = path.join(CachedDir, "Cached.json");
    await fs.mkdir(CachedDir, { recursive: true });

    try {
        Processed = JSON.parse(await fs.readFile(CachedPath, { encoding: "utf-8" }));
        const Rows: string[][] = Object.entries(Processed)
            .filter(([Key, ]) => Key !== "Timestamp")
            .map(([Key, Value]) => [Key, String(Value)])
        ;
        if(IsTodayUTC(Processed.Timestamp)) {
            return Table.New(Rows);
        }
    }
    catch {}

    Processed = {
        ...await ProcessRequest(),
        Timestamp: Date.now()
    };
    console.log(Object.entries(Processed));
    await fs.writeFile(CachedPath, JSON.stringify(Processed, undefined, 4), { encoding: "utf-8" });
    const Rows: string[][] = Object.entries(Processed)
        .filter(([Key, ]) => Key !== "Timestamp")
        .map(([Key, Value]) => [Key, String(Value)])
    ;
    return Table.New(Rows);
};

export default Stats;