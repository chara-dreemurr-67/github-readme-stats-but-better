export default class Table {
    private Table: string[][] = [];

    public constructor(Row: number = 1, Column: number = 1) {
        if(Row <= 0 && Column <= 0)
            throw new Error("Cannot create a table with 0 cells.");
        else if(Column <= 0) 
            throw new Error("Cannot create a table with 0 columns.");
        else if(Row <= 0) 
            throw new Error("Cannot create a table with 0 rows.");
        
        while(this.Table.length < Row) {
            this.Table.push(new Array(Column).fill(""))
        }
    }

    public static New(_Table: string[][]): Table {
        if(_Table.length === 0)
            throw new Error("Cannot create a table with 0 rows.");

        const NumberOfColumns: number = Math.min(..._Table.map(Row => Row.length));
        if(NumberOfColumns === 0) 
            throw new Error("Cannot create a table with 0 columns.");
        
        for(const [i, Row] of _Table.entries()) {
            if(Row.length !== NumberOfColumns) {
                throw new Error(`Row ${i} has ${Row.length} columns, expected ${NumberOfColumns}.`);
            }
        }

        const New: Table = new Table();
        New.Table = _Table;
        return New;
    }

    public ToString(Alignment: "Left" | "Right" | "Center" | "L" | "R" | "C" = "L"): string {
        const LongestPerColumn: number[] = Table.Zip(...this.Table).map(Column => Math.max(...Column.map(Cell => Cell.length)));

        const Output: string[] = [`┌${LongestPerColumn.map(Width => "─".repeat(Width + 2)).join("┬")}┐`];

        for(const [Index, Row] of this.Table.entries()) {
            const Separator: string = Index === this.Table.length - 1
                ? `└${LongestPerColumn.map(Width => "─".repeat(Width + 2)).join("┴")}┘` 
                : `├${LongestPerColumn.map(Width => "─".repeat(Width + 2)).join("┼")}┤`
            ;
            const CellStrings: string[] = [...Row.entries()].map(([Column, Cell]) => 
                Alignment.startsWith("R") 
                    ? Cell.padStart(LongestPerColumn[Column]) 
                : Alignment.startsWith("L") 
                    ? Cell.padEnd(LongestPerColumn[Column]) 
                : Table.Center(Cell, LongestPerColumn[Column])
            );

            const RowString: string = `│ ${CellStrings.join(" │ ")} │`;
            Output.push(RowString, Separator);
        }
        return Output.join("\n");
    };

    private static Zip = <T>(...Iterators: T[][]): T[][] =>  
        Array.from(
            { length: Math.min(...Iterators.map(It => It.length)) }, 
            (_, i) => Iterators.map(It => It[i])
        );

    private static Center(string: string, width: number, pad: string = " "): string {
        if(string.length >= width)
            return string;

        const TotalPadding = width - string.length;
        const Left = Math.floor(TotalPadding / 2.0);
        const Right = TotalPadding - Left;
        return `${pad.repeat(Left)}${string}${pad.repeat(Right)}`;
    };
}