import { type Processed } from "./helpers/ProcessRequest.js";
import ProcessRequest from "./helpers/ProcessRequest.js";
import Table from "./helpers/Table.js";

const Stats = async (): Promise<Table> => {
    const Processed: Processed = await ProcessRequest();
    const Rows: string[][] = Object.entries(Processed)
        .map(([Key, Value]) => [Key, String(Value)])
    ;
    return Table.New(Rows);
};

export default Stats;