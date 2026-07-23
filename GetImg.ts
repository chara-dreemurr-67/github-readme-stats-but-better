import { Canvas as C, FontLibrary, type CanvasRenderingContext2D } from "skia-canvas";
import { fileURLToPath } from "url";

FontLibrary.use(
    "Consolas",
    [fileURLToPath(new URL("./asset/Consolas.ttf", import.meta.url))]
);

const Clamp = (Number: number, Min: number, Max?: number): number => {
    if(Max === undefined) {
        [Min, Max] = [0, Min];
    }
    return Math.min(Math.max(Number, Min), Max);
};

const GetImg = async (Color: number, Opacity: number, Size: number, String: string): Promise<Buffer> => {
    Color = Clamp(Color, 16777215);
    Opacity = Clamp(Opacity, 1);
    String = String.trim();

    const TextColor: string = Color > 8388607 ? "black" : "white";

    const Lines: string[] = String.split("\n");
    
    const Width: number = Lines[0].length * Size / 1.5;
    const Height: number = Lines.length * Size;
    const StartY = Lines.length * Size / 2 - Height / 2.2;
    const R: number = (Color >> 16) & 255;
    const G: number = (Color >> 8) & 255;
    const B: number = Color & 255;

    const Canvas: C = new C(Width, Height);
    const Context: CanvasRenderingContext2D = Canvas.getContext("2d");

    Context.fillStyle = `rgba(${R}, ${G}, ${B}, ${Opacity})`;
    Context.fillRect(0, 0, Width, Height);

    Context.font = `${Size}px Consolas`;
    Context.fillStyle = TextColor;
    Context.textAlign = "center";
    Context.textBaseline = "middle";

    for(const [Index, Line] of Lines.entries()) {
        Context.fillText(
            Line,
            Width / 2,
            StartY + Index * Size
        );
    }
    return await Canvas.toBuffer("svg");
};

export default GetImg;