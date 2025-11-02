// --------------------------------------
// Code from DFRobot lcdDisplay extension
// --------------------------------------
// Original code has MIT license and copyright (c) 2021 TgJe.
// Available at: https://github.com/DFRobot/pxt-DFRobot_lcdDisplay
// Modified to hide blocks that access display directly.

const enum LCDWidgetCategoryOne {
    Slider = 1,
    Bar = 2,
    Compass = 3,
    Gauge = 4,
    LineMeter = 5,
}

const enum LCDWidgetCategoryTwo {
    Slider = 1,
    Bar = 2,
    Compass = 3,
    Gauge = 4,
    LineMeter = 5,
    Chart = 6,
    Text = 7,
    Line = 8,
    Rectangle = 9,
    Circle = 10,
    Triangle = 11,
    Icon = 12,
    Gif = 13,
}

enum FontSize {
    Large = 1,
    Small = 2,
}

enum RectangleRound {
    IsRound = 1,
    NoneRound = 2,
}

enum ChartStyles {
    LineChart = 3,
    BarChart = 2,
    ShadingLineChart = 1,
}

enum DrawType {
    Fill = 1,
    NotFill = 2,
}

enum Protocol {
    IIC = 1,
    Serial = 2,
}

const IIC_MAX_TRANSFER_SIZE = 32;

// cmd len
const CMDLEN_OF_HEAD_LEN = 3;
const CMD_DELETE_OBJ_LEN = 0x06;
const CMD_SET_TOP_OBJ_LEN = 0x06;
const CMD_SET_COMPASS_VALUE_LEN = 0x07;
const CMD_SET_LEN = 0x07;
const CMD_SET_GAUGE_VALUE_LEN = 0x07;
const CMD_SET_LINE_METER_VALUE_LEN = 0x07;
const CMD_SET_BAR_VALUE_LEN = 0x07;
const CMD_SET_SLIDER_VALUE_LEN = 0x07;
const CMD_SET_ANGLE_OBJ_LEN = 0x08;
const CMD_DRAW_COMPASS_LEN = 0x0B;
const CMD_DRAW_CHART_LEN = 0x09;
const CMD_DRAW_SERIE_LEN = 0x09;
const CMD_OF_DRAW_ICON_INTERNAL_LEN = 0x0D;
const CMD_OF_DRAW_GIF_INTERNAL_LEN = 0x0D;
const CMD_OF_DRAW_BAR_LEN = 0x10;
const CMD_OF_DRAW_SLIDER_LEN = 0x10;
const CMD_DRAW_PIXEL_LEN = 0x11;
const CMD_DRAW_LINE_LEN = 0x11;
const CMD_OF_DRAW_CIRCLE_LEN = 0x13;
const CMD_OF_DRAW_GAUGE_LEN = 0x15;
const CMD_OF_DRAW_LINE_METER_LEN = 0x15;
const CMD_OF_DRAW_RECT_LEN = 0x16;
const CMD_OF_DRAW_TRIANGLE_LEN = 0x19;

// cmd
const CMD_SET_BACKGROUND_COLOR = 0x19;
const CMD_SET_BACKGROUND_IMG = 0x1A;
const CMD_OF_DRAW_PIXEL = 0x02;
const CMD_OF_DRAW_LINE = 0x03;
const CMD_OF_DRAW_RECT = 0x04;
const CMD_OF_DRAW_CIRCLE = 0x06;
const CMD_OF_DRAW_TRIANGLE = 0x07;
const CMD_OF_DRAW_ICON_INTERNAL = 0x08;
const CMD_OF_DRAW_ICON_EXTERNAL = 0x09;
const CMD_OF_DRAW_BAR = 0x0A;
const CMD_OF_DRAW_BAR_VALUE = 0x0B;
const CMD_OF_DRAW_SLIDER = 0x0C;
const CMD_OF_DRAW_SLIDER_VALUE = 0x0D;
const CMD_OF_DRAW_LINE_METER = 0x10;
const CMD_OF_DRAW_LINE_METER_VALUE = 0x11;
const CMD_OF_DRAW_COMPASS = 0x0E;
const CMD_OF_DRAW_COMPASS_VALUE = 0x0F;
const CMD_OF_DRAW_GAUGE = 0x12;
const CMD_OF_DRAW_GAUGE_VALUE = 0x13;
const CMD_OF_DRAW_LINE_CHART = 0x14;
const CMD_OF_DRAW_LINE_CHART_TEXT = 0x15;
const CMD_OF_DRAW_SERIE = 0x16;
const CMD_OF_DRAW_SERIE_DATA = 0x17;
const CMD_OF_DRAW_TEXT = 0x18;
const CMD_DELETE_OBJ = 0x1B;
const CMD_SET_TOP_OBJ = 0x1C;
const CMD_SET_ANGLE_OBJ = 0x1E;
const CMD_OF_DRAW_GIF_INTERNAL = 0x1F;
const CMD_OF_DRAW_GIF_EXTERNAL = 0x20;

const CMD_HEADER_HIGH = 0x55;
const CMD_HEADER_LOW = 0xaa;

let address = 0x2c;
class GenericNode {
    id: number
    next: GenericNode
    constructor(id: number) {
        this.id = id;
        this.next = null;
    }
}

class LinkedList {
    head: GenericNode
    size: number
    id: number
    constructor() {
        this.head = null;
        this.size = 0;
        this.id = 1;
    }

    // adds a node to the end of the linked list
    append() {
        const newNode = new GenericNode(this.id);
        if (this.head == null) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next != null) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.size++;
        this.id++;
    }
    // insert a node at a specific location
    insert(index: number, id: number): boolean {
        if (index < 0 || index > this.size) {
            return false;
        }
        const newNode = new GenericNode(id);
        if (index == 0) {
            newNode.next = this.head;
            this.head = newNode;
        } else {
            let current = this.head;
            let previous = null;
            let i = 0;
            while (i < index) {
                previous = current;
                current = current.next;
                i++;
            }
            newNode.next = current;
            previous.next = newNode;
        }
        this.size++;
        return true;
    }
    // removes a node at a specific location
    removeAt(index: number): boolean {
        if (index < 0 || index >= this.size || this.head == null) {
            return false;
        }
        let current = this.head;
        if (index == 0) {
            this.head = current.next;
        } else {
            let previous = null;
            let i = 0;
            while (i < index) {
                previous = current;
                current = current.next;
                i++;
            }
            previous.next = current.next;
        }
        this.size--;
        return true;
    }

    // example Remove a node with a specific id
    removeId(id: number): boolean {
        if (this.head == null) {
            return false;
        }
        let current = this.head;
        if (current.id == id) {
            this.head = current.next;
        } else {
            let previous = null;
            while (current.id != id) {
                previous = current;
                current = current.next;
            }
            previous.next = current.next;
        }
        this.size--;
        return true;
    }
}

type GenericList = {
    lineChartHead: LinkedList | null,
    seriesHead: LinkedList | null,
    compassHead: LinkedList | null,
    textHead: LinkedList | null,
    gaugeHead: LinkedList | null,
    lineHead: LinkedList | null,
    rectHead: LinkedList | null,
    circleHead: LinkedList | null,
    triangleHead: LinkedList | null,
    lineMeterHead: LinkedList | null,
    barHead: LinkedList | null,
    sliderHead: LinkedList | null,
    iconHead: LinkedList | null,
    gifHead: LinkedList | null,
}

let list: GenericList = {
    lineChartHead: null,
    seriesHead: null,
    compassHead: null,
    textHead: null,
    gaugeHead: null,
    lineHead: null,
    rectHead: null,
    circleHead: null,
    triangleHead: null,
    lineMeterHead: null,
    barHead: null,
    sliderHead: null,
    iconHead: null,
    gifHead: null,
}
let protocol: Protocol = Protocol.IIC;
let chartID = 0;
let axisListX: string[] = [];
let axisListY: string[] = [];
let axisYData: number[] = [];
let seriesData: any = {};
let dataFactor = 1; // "data coordinate conversion factors

/**
 * Original block "ColorScreen I2C initialization"
 */
function lcdInitIIC() {
    creatList();
    protocol = Protocol.IIC;
    basic.pause(1000);
}

/**
 * Original block "clear the screen"
 */
function lcdClearAll() {
    cleanScreen();
}

/**
 * Original block "set the background color %color"
 * @param color to color ,eg: 0xFF0000
 */
function lcdSetBgcolor(color: number) {
    setBackgroundColor(colorToCustom(color));
}

/**
 * Original block "red %red green %green blue %blue"
 * Convert red, green and blue channels into a RGB color
 * @param red to red ,eg: 255 (min 0, max 255, default 255)
 * @param green to green ,eg: 255 (min 0, max 255, default 255)
 * @param blue to blue ,eg: 255 (min 0, max 255, default 255)
 */
function lcdGetRgbColor(red: number, green: number, blue: number): number {
    return (red << 16) + (green << 8) + (blue);
}

/**
 * Original block "set the background picture %picture"
 * @param picture to picture ,eg: "fruit.png"
 */
function lcdSetBgIamge(picture: string) {
    //setBackgroundImg(0, picture); // Internal storage of pictures
    setBackgroundImg(1, picture); // Usb flash drive to store pictures
}

/**
 * Original block "display text %text number %num position x: %x y: %y size %size color %color"
 * @param text to text ,eg: "hello"
 * @param num to num ,eg: 1 (min 1, max 255, default 1)
 * @param x to x ,eg: 120 (min 0, max 320, default 120)
 * @param y to y ,eg: 120 (min 0, max 240, default 120)
 * @param size to size ,eg: FontSize.Large
 * @param color to color ,eg: 0xFF0000
 */
function lcdDisplayText(text: string, num: number, x: number, y: number, size: FontSize, color: number) {
    updateString(num, x, y, text, size, color);
}

/**
 * Original block "display time number %num time %time position x: %x y: %y size %size color %color"
 * Was marked as deprecated.
 * @param num to num ,eg: 1 (min 1, max 255, default 1)
 * @param time to time ,eg: "12:40:30"
 * @param x to x ,eg: 120 (min 0, max 320, default 120)
 * @param y to y ,eg: 120 (min 0, max 320, default 120)
 * @param size to size ,eg: FontSize.Large
 * @param color to color ,eg: 0xFF0000
 */
function lcdDisplayTime(num: number, time: string, x: number, y: number, size: FontSize, color: number) {
    updateString(num, x, y, time, size, color);
}

/**
 * Original block "hour %hour minutes %min second %sec"
 * @param hour to hour ,eg: 12 (min 0, max 23, default 12)
 * @param min to min ,eg: 40 (min 0, max 59, default 40)
 * @param sec to sec ,eg: 30 (min 0, max 59, default 30)
 */
function lcdGetTime(hour: number, min: number, sec: number): string {
    return `${hour < 10 ? "0" + hour : "" + hour}:${min < 10 ? "0" + min : "" + min}:${sec < 10 ? "0" + sec : "" + sec}`
}

/**
 * Original block "display image number %num name %name position x: %x y: %y size %size"
 * @param num to num ,eg: 1 (min 1, max 255, default 1)
 * @param name to name ,eg: "/expression icon/happy.png"
 * @param x to x ,eg: 120 (min 0, max 320, default 120)
 * @param y to y ,eg: 120 (min 0, max 320, default 120)
 * @param size to size ,eg: FontSize.Large
 */
function lcdDisplayImage(num: number, name: string, x: number, y: number, size: number) {
    updateIcon(num, x, y, name, size);
}

/**
 * Original block "rotate image number %num angle %angle"
 * @param num to num ,eg: 1 (min 1, max 255, default 1)
 * @param angle to angle ,eg: 180 (min 0, max 360, default 180)
 */
function lcdRotateIamge(num: number, angle: number) {
    setAngleIcon(num, angle * 10);
}

/**
 * Original block "display gif number %num name %name position x: %x y: %y size %size"
 * @param num to num ,eg: 1
 * @param name to name ,eg: "Snowy.gif"
 * @param x to x ,eg: 120 (min 0, max 320, default 120)
 * @param y to y ,eg: 120 (min 0, max 320, default 120)
 * @param size to size ,eg: FontSize.Large
 */
function lcdDisplayGif(num: number, name: string, x: number, y: number, size: number) {
    updateGif(num, x, y, name, size);
}

/**
 * Original block "draw line number %num start x1: %x1 y1: %y1 end x2: %x2 y2: %y2 width %width color %color"
 * @param num to num ,eg: 1 (min 1, max 255, default 1)
 * @param x1 to x1 ,eg: 40 (min 0, max 320, default 40)
 * @param y1 to y1 ,eg: 120 (min 0, max 240, default 120)
 * @param x2 to x2 ,eg: 300 (min 0, max 320, default 300)
 * @param y2 to y2 ,eg: 120 (min 0, max 240, default 120)
 * @param width to width ,eg: 20
 * @param color to color ,eg: 0x007FFF
 */
function lcdDrawLine(num: number, x1: number, y1: number, x2: number, y2: number, width: number, color: number) {
    updateLine(num, x1, y1, x2, y2, width, color);
}

/**
 * Original block "draw rectangle number %num start x: %x y: %y width %w height %h line width %width Border color %bocolor %fill color %fcolor %round"
 * @param num to num ,eg: 1 (min 1, max 255, default 1)
 * @param x to x ,eg: 0 (min 0, max 320, default 0)
 * @param y to y ,eg: 0 (min 0, max 240, default 0)
 * @param w to w ,eg: 300 (min 0, max 320, default 300)
 * @param h to h ,eg: 200 (min 0, max 240, default 200)
 * @param width to width ,eg: 5
 * @param bocolor to bocolor ,eg: 0xFF0000
 * @param fill to fill ,eg: DrawType.Fill
 * @param fcolor to fcolor ,eg: 0xFFFFFF
 * @param round to round ,eg: lcdDisplay.RectangleRound.NoneRound
 */
function lcdDrawRectangle(num: number, x: number, y: number, w: number, h: number, width: number, bocolor: number, fill: DrawType, fcolor: number, round: RectangleRound) {
    updateRect(num, x, y, w, h, width, bocolor, fill === DrawType.Fill ? 1 : 0, fcolor, round === RectangleRound.IsRound ? 1 : 0);
}

/**
 * Original block "draw circle number %num center x: %x y: %y radius %r line width %width Border color %bocolor %fill color %fcolor"
 * @param num to num ,eg: 1 (min 1, max 255, default 1)
 * @param x to x ,eg: 160 (min 0, max 320, default 160)
 * @param y to y ,eg: 120 (min 0, max 240, default 120)
 * @param r to r ,eg: 120 (min 0, max 120, default 120)
 * @param width to width ,eg: 5
 * @param bocolor to bocolor ,eg: 0xFF0000
 * @param fill to fill ,eg: DrawType.Fill
 * @param fcolor to fcolor ,eg: 0xFFFFFF
 */
function lcdDrawCircle(num: number, x: number, y: number, r: number, width: number, bocolor: number, fill: DrawType, fcolor: number) {
    updateCircle(num, x, y, r, width, bocolor, fill === DrawType.Fill ? 1 : 0, fcolor);
}

/**
 * Original block "draw triangle number %num x1: %x1 y1: %y1 x2: %x2 y2: %y2 x3: %x3 y3: %y3 line width %width Border color %bocolor %fill color %fcolor"
 * @param num to num ,eg: 1 (min 1, max 255, default 1)
 * @param x1 to x1 ,eg: 160 (min 0, max 320, default 160)
 * @param y1 to y1 ,eg: 0 (min 0, max 240, default 0)
 * @param x2 to x2 ,eg: 0 (min 0, max 320, default 0)
 * @param y2 to y2 ,eg: 240 (min 0, max 240, default 240)
 * @param x3 to x3 ,eg: 320 (min 0, max 320, default 320)
 * @param y3 to y3 ,eg: 240 (min 0, max 240, default 240)
 * @param width to width ,eg: 5
 * @param bocolor to bocolor ,eg: 0xFF0000
 * @param fill to fill ,eg: DrawType.Fill
 * @param fcolor to fcolor ,eg: 0xFFFFFF
 */
function lcdDrawTriangle(num: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, width: number, bocolor: number, fill: DrawType, fcolor: number) {
    updateTriangle(num, x1, y1, x2, y2, x3, y3, width, bocolor, fill === DrawType.Fill ? 1 : 0, fcolor);
}

/**
 * Original block "draw slider number %num position x: %x y: %y width %w height %h color %color"
 * @param num to num ,eg: 1 (min 1, max 255, default 1)
 * @param x to x ,eg: 80 (min 0, max 320, default 80)
 * @param y to y ,eg: 120 (min 0, max 240, default 120)
 * @param w to w ,eg: 200 (min 0, max 320, default 200)
 * @param h to h ,eg: 20 (min 0, max 240, default 20)
 * @param color to color ,eg: 0x007FFF
 */
function lcdDrawSlider(num: number, x: number, y: number, w: number, h: number, color: number) {
    updateSlider(num, x, y, w, h, color);
}

/**
 * Original block "draw bar number %num position x: %x y: %y width %w height %h color %color"
 * @param num to num ,eg: 1 (min 1, max 255, default 1)
 * @param x to x ,eg: 80 (min 0, max 320, default 80)
 * @param y to y ,eg: 120 (min 0, max 240, default 120)
 * @param w to w ,eg: 200 (min 0, max 320, default 200)
 * @param h to h ,eg: 20 (min 0, max 240, default 20)
 * @param color to color ,eg: 0x007FFF
 */
function lcdDrawBar(num: number, x: number, y: number, w: number, h: number, color: number) {
    updateBar(num, x, y, w, h, color);
}

/**
 * Original block "draw compass number %num position x: %x y: %y radius %r"
 * @param num to num ,eg: 1 (min 1, max 255, default 1)
 * @param x to x ,eg: 50 (min 0, max 320, default 50)
 * @param y to y ,eg: 0 (min 0, max 240, default 0)
 * @param r to r ,eg: 240 (min 0, max 320, default 240)
 */
function lcdDrawCompass(num: number, x: number, y: number, r: number) {
    updateCompass(num, x, y, r);
}

/**
 * Original block "draw gauge number %num position x: %x y: %y radius %r start of scale %start End of scale %end Pointer color %color Dial color %dcolor"
 * @param num to num ,eg: 1 (min 1, max 255, default 1)
 * @param x to x ,eg: 50 (min 0, max 320, default 50)
 * @param y to y ,eg: 0 (min 0, max 240, default 0)
 * @param r to r ,eg: 240 (min 0, max 320, default 240)
 * @param start to start ,eg: 0 (min 0, max 360, default 0)
 * @param end to end ,eg: 360 (min 0, max 360, default 360)
 * @param color to color ,eg: 0x000000
 * @param dcolor to dcolor ,eg: 0xFFFFFF
 */
function lcdDrawGauge(num: number, x: number, y: number, r: number, start: number, end: number, color: number, dcolor: number) {
    updateGauge(num, x, y, r, start, end, color, dcolor);
}

/**
 * Original block "draw lineMeter number %num position x: %x y: %y radius %r start of scale %start End of scale %end Data color %color Dial color %dcolor"
 * @param num to num ,eg: 1 (min 1, max 255, default 1)
 * @param x to x ,eg: 0 (min 0, max 320, default 0)
 * @param y to y ,eg: 0 (min 0, max 240, default 0)
 * @param r to r ,eg: 240 (min 0, max 320, default 240)
 * @param start to start ,eg: 0 (min 0, max 360, default 0)
 * @param end to end ,eg: 100 (min 0, max 360, default 100)
 * @param color to color ,eg: 0x000000
 * @param dcolor to dcolor ,eg: 0xFFFFFF
 */
function lcdDrawLineMeter(num: number, x: number, y: number, r: number, start: number, end: number, color: number, dcolor: number) {
    updateLineMeter(num, x, y, r, start, end, color, dcolor);
}

/**
 * Original block "set %type=LCDWidgetCategoryOne_conv widget number %num data %data"
 * @param type to type ,eg: LCDWidgetCategoryOne.Slider
 * @param num to num ,eg: 1 (min 1, max 255, default 1)
 * @param data to data ,eg: 80
 */
function lcdSetWidgetData(type: number, num: number, data: number) {
    switch (type) {
        case LCDWidgetCategoryOne.Slider:
            setSliderValue(num, data);
            break;
        case LCDWidgetCategoryOne.Bar:
            setBarValue(num, data);
            break;
        case LCDWidgetCategoryOne.Compass:
            setCompassScale(num, (data / 360) * 3600);
            break;
        case LCDWidgetCategoryOne.Gauge:
            setGaugeValue(num, data);
            break;
        case LCDWidgetCategoryOne.LineMeter:
            setMeterValue(num, data);
            break;
        default:
            break;
    }
}

/**
 * Original block "draw chart number %num X-axis %xaxis Y-axis %yaxis background color %color styles %styles"
 * @param num to num ,eg: 1 (min 1, max 255, default 1)
 * @param xaxis to xaxis ,eg: "Jan Feb Mar Apr May Jun"
 * @param yaxis to yaxis ,eg: "100 80 60 40 20 0"
 * @param color to color ,eg: 0xFFFFFF
 * @param styles to styles ,eg: ChartStyles.LineChart
 */
function lcdDrawChart(num: number, xaxis: string, yaxis: string, color: number, styles: ChartStyles) {
    chartID = num;
    axisListX = xaxis.split(" ");
    axisListY = yaxis.split(" ");
    axisListX.forEach((value, index) => { axisYData.push(0) });
    dataFactor = Math.abs((parseInt(axisListY[0]) - parseInt(axisListY[axisListY.length - 1])) / 100);
    updateChart(chartID, color, styles);
    basic.pause(100);
    setChartAxisTexts(chartID, 0, axisListX);
    basic.pause(100);
    setChartAxisTexts(chartID, 1, axisListY);
}

/**
 * Original block "Set chart data number %num color %color"
 * @param num to num ,eg: 1 (min 1, max 255, default 1)
 * @param color to color ,eg: 0xFF0000
 */
function lcdAddChartData(num: number, color: number) {
    seriesData[num] = axisYData;
    updateChartSeries(chartID, num, color);
    addChartSeriesData(chartID, num, seriesData[num], axisListX.length)
}

/**
 * Original block "set chart data number %num X-axis %xaxis data %data"
 * @param num to num ,eg: 1 (min 1, max 255, default 1)
 * @param xaxis to xaxis ,eg: "Jan"
 * @param data to data ,eg: 80
 */
function lcdSetChartData(num: number, xaxis: string, data: number) {
    let index = axisListX.indexOf(xaxis);
    if (data < parseInt(axisListY[axisListY.length - 1]) || data > parseInt(axisListY[0]))
        return
    if (index !== -1) {
        updateChartPoint(chartID, num, index, Math.round((data - parseInt(axisListY[axisListY.length - 1])) / dataFactor));
        // seriesData[num][index] = Math.round(data / 10);
    }
}

/**
 * Original block "update chart number %num background color %color styles %styles"
 * @param num to num ,eg: 1 (min 1, max 255, default 1)
 * @param color to color ,eg: 0x007FFF
 * @param styles to styles ,eg: lcdDisplay.ChartStyles.BarChart
 */
function lcdUpdateChart(num: number, color: number, styles: ChartStyles) {
    updateChart(num, color, styles);
}

/**
 * Original block "delete %type=LCDWidgetCategoryTwo_conv number %num"
 * @param type to type ,eg: LCDWidgetCategoryTwo.Text
 * @param num to num ,eg: 1 (min 1, max 255, default 1)
 */
function lcdDeleteWidget(type: number, num: number) {
    switch (type) {
        case LCDWidgetCategoryTwo.Slider:
            deleteSlider(num);
            break;
        case LCDWidgetCategoryTwo.Bar:
            deleteBar(num);
            break;
        case LCDWidgetCategoryTwo.Compass:
            deleteCompass(num);
            break;
        case LCDWidgetCategoryTwo.Gauge:
            deleteGauge(num);
            break;
        case LCDWidgetCategoryTwo.LineMeter:
            deleteLineMeter(num);
            break;
        case LCDWidgetCategoryTwo.Chart:
            deleteChart(num);
            break;
        case LCDWidgetCategoryTwo.Text:
            deleteString(num);
            break;
        case LCDWidgetCategoryTwo.Line:
            deleteLine(num);
            break;
        case LCDWidgetCategoryTwo.Rectangle:
            deleteRect(num);
            break;
        case LCDWidgetCategoryTwo.Circle:
            deleteCircle(num);
            break;
        case LCDWidgetCategoryTwo.Triangle:
            deleteTriangle(num);
            break;
        case LCDWidgetCategoryTwo.Icon:
            deleteIcon(num);
            break;
        case LCDWidgetCategoryTwo.Gif:
            deleteGif(num);
        default:
            break;
    }
}

/**
 * Original blockId "LCDWidgetCategoryOne_conv" and block "%item"
 * return the corresponding LCDWidgetCategoryOne number
 */
function getWidgetCategoryOne(item: LCDWidgetCategoryOne): number {
    return item as number;
}

/**
 * Original blockId "LCDWidgetCategoryTwo_conv" and block "%item"
 * return the corresponding LCDWidgetCategoryTwo number
 */
function getLCDWidgetCategoryTwo(item: LCDWidgetCategoryTwo): number {
    return item as number;
}

function cleanScreen() {
    let cmd = creatCommand(0x1D, 0x04);
    writeCommand(cmd, 4);
    basic.pause(1500);
}

function setBackgroundColor(color: number) {
    let cmd = creatCommand(CMD_SET_BACKGROUND_COLOR, CMD_SET_LEN);
    cmd = cmd.concat(data24Tobyte(color));
    writeCommand(cmd, CMD_SET_LEN);
    basic.pause(300);
}

function setBackgroundImg(location: number, str: string) {
    let len = str.length;
    let cmd = creatCommand(CMD_SET_BACKGROUND_IMG, len + 5);
    cmd = cmd.concat([location]);
    str.split("").forEach((value, index) => { cmd.push(value.charCodeAt(0)) });
    writeCommand(cmd, len + 5);
}

function drawString(x: number, y: number, str: string, fontSize: number, color: number) {
    let len = str.length > 242 ? 242 : str.length;
    let cmd = creatCommand(CMD_OF_DRAW_TEXT, len + 13);
    cmd = cmd.concat([getID(CMD_OF_DRAW_TEXT), fontSize]).concat(data24Tobyte(color)).concat(data16Tobyte(x)).concat(data16Tobyte(y));
    str.split("").forEach((value, index) => { cmd.push(value.charCodeAt(0)) });
    writeCommand(cmd, len + 13);
}

function updateString(id: number, x: number, y: number, str: string, fontSize: number, color: number) {
    let len = str.length > 242 ? 242 : str.length;
    let cmd = creatCommand(CMD_OF_DRAW_TEXT, len + 13);
    cmd = cmd.concat([id, fontSize]).concat(data24Tobyte(color)).concat(data16Tobyte(x)).concat(data16Tobyte(y));
    str.split("").forEach((value, index) => { cmd.push(value.charCodeAt(0)) });
    writeCommand(cmd, len + 13);
}

function deleteString(id: number) {
    let cmd = creatCommand(CMD_DELETE_OBJ, CMD_DELETE_OBJ_LEN);
    cmd = cmd.concat([CMD_OF_DRAW_TEXT, id])
    writeCommand(cmd, CMD_DELETE_OBJ_LEN);
    deleteNodeByID(list.textHead, id);
}

function drawLcdTime(x: number, y: number, hour: number, min: number, sec: number, fontSize: number, color: number) {
    drawString(x, y, `${hour < 10 ? "0" + hour : "" + hour}:${min < 10 ? "0" + min : "" + min}:${sec < 10 ? "0" + sec : "" + sec}`, fontSize, color);
}

function updateLcdTime(id: number, x: number, y: number, hour: number, min: number, sec: number, fontSize: number, color: number) {
    updateString(id, x, y, `${hour < 10 ? "0" + hour : "" + hour}:${min < 10 ? "0" + min : "" + min}:${sec < 10 ? "0" + sec : "" + sec}`, fontSize, color);
}

function drawIcon(x: number, y: number, str: string, zoom: number) {
    let len = str.length;
    let cmd = creatCommand(CMD_OF_DRAW_ICON_EXTERNAL, len + 11);
    cmd = cmd.concat([getID(CMD_OF_DRAW_ICON_INTERNAL)]).concat(data16Tobyte(zoom)).concat(data16Tobyte(x)).concat(data16Tobyte(y));
    str.split("").forEach((value, index) => { cmd.push(value.charCodeAt(0)) });
    writeCommand(cmd, len + 11);
}

function setAngleIcon(id: number, angle: number) {
    let cmd = creatCommand(CMD_SET_ANGLE_OBJ, CMD_SET_ANGLE_OBJ_LEN);
    cmd = cmd.concat([CMD_OF_DRAW_ICON_INTERNAL, id]).concat(data16Tobyte(angle));
    writeCommand(cmd, CMD_SET_ANGLE_OBJ_LEN);
}

function updateIcon(id: number, x: number, y: number, str: string, zoom: number) {
    let len = str.length;
    let cmd = creatCommand(CMD_OF_DRAW_ICON_EXTERNAL, len + 11);
    cmd = cmd.concat([id]).concat(data16Tobyte(zoom)).concat(data16Tobyte(x)).concat(data16Tobyte(y));
    str.split("").forEach((value, index) => { cmd.push(value.charCodeAt(0)) });
    writeCommand(cmd, len + 11);
}

function deleteIcon(id: number) {
    let cmd = creatCommand(CMD_DELETE_OBJ, CMD_DELETE_OBJ_LEN);
    cmd = cmd.concat([CMD_OF_DRAW_ICON_INTERNAL, id]);
    writeCommand(cmd, CMD_DELETE_OBJ_LEN);
    deleteNodeByID(list.iconHead, id);
}

function drawGif(x: number, y: number, str: string, zoom: number): number {
    let len = str.length;
    let cmd = creatCommand(CMD_OF_DRAW_GIF_EXTERNAL, len + 11);
    let id = getID(CMD_OF_DRAW_GIF_EXTERNAL);
    cmd = cmd.concat([id]).concat(data16Tobyte(zoom)).concat(data16Tobyte(x)).concat(data16Tobyte(y));
    str.split("").forEach((value, index) => { cmd.push(value.charCodeAt(0)) });
    writeCommand(cmd, len + 11);
    return id;
}

function updateGif(id: number, x: number, y: number, str: string, zoom: number) {
    let len = str.length;
    let cmd = creatCommand(CMD_OF_DRAW_GIF_EXTERNAL, len + 11);
    cmd = cmd.concat([id]).concat(data16Tobyte(zoom)).concat(data16Tobyte(x)).concat(data16Tobyte(y));
    str.split("").forEach((value, index) => { cmd.push(value.charCodeAt(0)) });
    writeCommand(cmd, len + 11);
}

function deleteGif(id: number) {
    let cmd = creatCommand(CMD_DELETE_OBJ, CMD_DELETE_OBJ_LEN);
    cmd = cmd.concat([CMD_OF_DRAW_GIF_INTERNAL, id]);
    writeCommand(cmd, CMD_DELETE_OBJ_LEN);
    deleteNodeByID(list.gifHead, id);
}

function drawLine(x0: number, y0: number, x1: number, y1: number, width: number, color: number) {
    let cmd = creatCommand(CMD_OF_DRAW_LINE, CMD_DRAW_LINE_LEN);
    cmd = cmd.concat([getID(CMD_OF_DRAW_LINE), width]).concat(data24Tobyte(color)).concat(data16Tobyte(x0)).concat(data16Tobyte(y0)).concat(data16Tobyte(x1)).concat(data16Tobyte(y1));
    writeCommand(cmd, CMD_DRAW_LINE_LEN);
}

function updateLine(id: number, x0: number, y0: number, x1: number, y1: number, width: number, color: number) {
    let cmd = creatCommand(CMD_OF_DRAW_LINE, CMD_DRAW_LINE_LEN);
    cmd = cmd.concat([id, width]).concat(data24Tobyte(color)).concat(data16Tobyte(x0)).concat(data16Tobyte(y0)).concat(data16Tobyte(x1)).concat(data16Tobyte(y1));
    writeCommand(cmd, CMD_DRAW_LINE_LEN);
    basic.pause(10);
}

function deleteLine(id: number) {
    let cmd = creatCommand(CMD_DELETE_OBJ, CMD_DELETE_OBJ_LEN);
    cmd = cmd.concat([CMD_OF_DRAW_LINE, id]);
    writeCommand(cmd, CMD_DELETE_OBJ_LEN);
    deleteNodeByID(list.lineHead, id);
}

function drawRect(x: number, y: number, w: number, h: number, bw: number, boColor: number, fill: number, fillColor: number, rounded: number) {
    let cmd = creatCommand(CMD_OF_DRAW_RECT, CMD_OF_DRAW_RECT_LEN);
    cmd = cmd.concat([getID(CMD_OF_DRAW_RECT), bw]).concat(data24Tobyte(boColor)).concat([fill]).concat(data24Tobyte(fillColor)).concat([rounded]).concat(data16Tobyte(x)).concat(data16Tobyte(y)).concat(data16Tobyte(w)).concat(data16Tobyte(h));
    writeCommand(cmd, CMD_OF_DRAW_RECT_LEN);
}

function updateRect(id: number, x: number, y: number, w: number, h: number, bw: number, boColor: number, fill: number, fillColor: number, rounded: number) {
    let cmd = creatCommand(CMD_OF_DRAW_RECT, CMD_OF_DRAW_RECT_LEN);
    cmd = cmd.concat([id, bw]).concat(data24Tobyte(boColor)).concat([fill]).concat(data24Tobyte(fillColor)).concat([rounded]).concat(data16Tobyte(x)).concat(data16Tobyte(y)).concat(data16Tobyte(w)).concat(data16Tobyte(h));
    writeCommand(cmd, CMD_OF_DRAW_RECT_LEN);
}

function deleteRect(id: number) {
    let cmd = creatCommand(CMD_DELETE_OBJ, CMD_DELETE_OBJ_LEN);
    cmd = cmd.concat([CMD_OF_DRAW_RECT, id]);
    writeCommand(cmd, CMD_DELETE_OBJ_LEN);
    deleteNodeByID(list.rectHead, id);
}

function drawCircle(x: number, y: number, r: number, bw: number, boColor: number, fill: number, fillColor: number) {
    let cmd = creatCommand(CMD_OF_DRAW_CIRCLE, CMD_OF_DRAW_CIRCLE_LEN);
    cmd = cmd.concat([getID(CMD_OF_DRAW_CIRCLE), bw]).concat(data24Tobyte(boColor)).concat([fill]).concat(data24Tobyte(fillColor)).concat(data16Tobyte(r)).concat(data16Tobyte(x)).concat(data16Tobyte(y));
    writeCommand(cmd, CMD_OF_DRAW_CIRCLE_LEN);
}

function updateCircle(id: number, x: number, y: number, r: number, bw: number, boColor: number, fill: number, fillColor: number) {
    let cmd = creatCommand(CMD_OF_DRAW_CIRCLE, CMD_OF_DRAW_CIRCLE_LEN);
    cmd = cmd.concat([id, bw]).concat(data24Tobyte(boColor)).concat([fill]).concat(data24Tobyte(fillColor)).concat(data16Tobyte(r)).concat(data16Tobyte(x)).concat(data16Tobyte(y));
    writeCommand(cmd, CMD_OF_DRAW_CIRCLE_LEN);
}

function deleteCircle(id: number) {
    let cmd = creatCommand(CMD_DELETE_OBJ, CMD_DELETE_OBJ_LEN);
    cmd = cmd.concat([CMD_OF_DRAW_CIRCLE, id]);
    writeCommand(cmd, CMD_DELETE_OBJ_LEN);
    deleteNodeByID(list.circleHead, id);
}

function drawTriangle(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, bw: number, boColor: number, fill: number, fillColor: number) {
    let cmd = creatCommand(CMD_OF_DRAW_TRIANGLE, CMD_OF_DRAW_TRIANGLE_LEN);
    cmd = cmd.concat([getID(CMD_OF_DRAW_TRIANGLE), bw]).concat(data24Tobyte(boColor)).concat([fill]).concat(data24Tobyte(fillColor)).concat(data16Tobyte(x0)).concat(data16Tobyte(y0)).concat(data16Tobyte(x1)).concat(data16Tobyte(y1)).concat(data16Tobyte(x2)).concat(data16Tobyte(y2));
    writeCommand(cmd, CMD_OF_DRAW_TRIANGLE_LEN);
}

function updateTriangle(id: number, x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, bw: number, boColor: number, fill: number, fillColor: number) {
    let cmd = creatCommand(CMD_OF_DRAW_TRIANGLE, CMD_OF_DRAW_TRIANGLE_LEN);
    cmd = cmd.concat([id, bw]).concat(data24Tobyte(boColor)).concat([fill]).concat(data24Tobyte(fillColor)).concat(data16Tobyte(x0)).concat(data16Tobyte(y0)).concat(data16Tobyte(x1)).concat(data16Tobyte(y1)).concat(data16Tobyte(x2)).concat(data16Tobyte(y2));
    writeCommand(cmd, CMD_OF_DRAW_TRIANGLE_LEN);
}

function deleteTriangle(id: number) {
    let cmd = creatCommand(CMD_DELETE_OBJ, CMD_DELETE_OBJ_LEN);
    cmd = cmd.concat([CMD_OF_DRAW_TRIANGLE, id]);
    writeCommand(cmd, CMD_DELETE_OBJ_LEN);
    deleteNodeByID(list.triangleHead, id);
}

function creatSlider(x: number, y: number, w: number, h: number, color: number) {
    let cmd = creatCommand(CMD_OF_DRAW_SLIDER, CMD_OF_DRAW_SLIDER_LEN);
    cmd = cmd.concat([getID(CMD_OF_DRAW_SLIDER)]).concat(data24Tobyte(color)).concat(data16Tobyte(x)).concat(data16Tobyte(y)).concat(data16Tobyte(w)).concat(data16Tobyte(h));
    writeCommand(cmd, CMD_OF_DRAW_SLIDER_LEN);
}

function updateSlider(id: number, x: number, y: number, w: number, h: number, color: number) {
    let cmd = creatCommand(CMD_OF_DRAW_SLIDER, CMD_OF_DRAW_SLIDER_LEN);
    cmd = cmd.concat([id]).concat(data24Tobyte(color)).concat(data16Tobyte(x)).concat(data16Tobyte(y)).concat(data16Tobyte(w)).concat(data16Tobyte(h));
    writeCommand(cmd, CMD_OF_DRAW_SLIDER_LEN);
}

function setSliderValue(id: number, value: number) {
    let cmd = creatCommand(CMD_OF_DRAW_SLIDER_VALUE, CMD_SET_SLIDER_VALUE_LEN);
    cmd = cmd.concat([id]).concat(data16Tobyte(value));
    writeCommand(cmd, CMD_SET_SLIDER_VALUE_LEN);
}

function deleteSlider(id: number) {
    let cmd = creatCommand(CMD_DELETE_OBJ, CMD_DELETE_OBJ_LEN);
    cmd = cmd.concat([CMD_OF_DRAW_SLIDER, id]);
    writeCommand(cmd, CMD_DELETE_OBJ_LEN);
    deleteNodeByID(list.sliderHead, id);
}

function creatBar(x: number, y: number, w: number, h: number, color: number) {
    let cmd = creatCommand(CMD_OF_DRAW_BAR, CMD_OF_DRAW_BAR_LEN);
    cmd = cmd.concat([getID(CMD_OF_DRAW_BAR)]).concat(data24Tobyte(color)).concat(data16Tobyte(x)).concat(data16Tobyte(y)).concat(data16Tobyte(w)).concat(data16Tobyte(h));
    writeCommand(cmd, CMD_OF_DRAW_BAR_LEN);
}

function updateBar(id: number, x: number, y: number, w: number, h: number, color: number) {
    let cmd = creatCommand(CMD_OF_DRAW_BAR, CMD_OF_DRAW_BAR_LEN);
    cmd = cmd.concat([id]).concat(data24Tobyte(color)).concat(data16Tobyte(x)).concat(data16Tobyte(y)).concat(data16Tobyte(w)).concat(data16Tobyte(h));
    writeCommand(cmd, CMD_OF_DRAW_BAR_LEN);
}

function setBarValue(id: number, value: number) {
    let cmd = creatCommand(CMD_OF_DRAW_BAR_VALUE, CMD_SET_BAR_VALUE_LEN);
    cmd = cmd.concat([id]).concat(data16Tobyte(value));
    writeCommand(cmd, CMD_SET_BAR_VALUE_LEN);
}

function deleteBar(id: number) {
    let cmd = creatCommand(CMD_DELETE_OBJ, CMD_DELETE_OBJ_LEN);
    cmd = cmd.concat([CMD_OF_DRAW_BAR, id]);
    writeCommand(cmd, CMD_DELETE_OBJ_LEN);
    deleteNodeByID(list.barHead, id);
}

function creatCompass(x: number, y: number, diameter: number) {
    let cmd = creatCommand(CMD_OF_DRAW_COMPASS, CMD_DRAW_COMPASS_LEN);
    cmd = cmd.concat([getID(CMD_OF_DRAW_COMPASS)]).concat(data16Tobyte(diameter)).concat(data16Tobyte(x)).concat(data16Tobyte(y));
    writeCommand(cmd, CMD_DRAW_COMPASS_LEN);
}

function updateCompass(id: number, x: number, y: number, diameter: number) {
    let cmd = creatCommand(CMD_OF_DRAW_COMPASS, CMD_DRAW_COMPASS_LEN);
    cmd = cmd.concat([id]).concat(data16Tobyte(diameter)).concat(data16Tobyte(x)).concat(data16Tobyte(y));
    writeCommand(cmd, CMD_DRAW_COMPASS_LEN);
}

function setCompassScale(id: number, scale: number) {
    let cmd = creatCommand(CMD_OF_DRAW_COMPASS_VALUE, CMD_SET_COMPASS_VALUE_LEN);
    cmd = cmd.concat([id]).concat(data16Tobyte(scale));
    writeCommand(cmd, CMD_SET_COMPASS_VALUE_LEN);
}

function deleteCompass(id: number) {
    let cmd = creatCommand(CMD_DELETE_OBJ, CMD_DELETE_OBJ_LEN);
    cmd = cmd.concat([CMD_OF_DRAW_COMPASS, id]);
    writeCommand(cmd, CMD_DELETE_OBJ_LEN);
    deleteNodeByID(list.compassHead, id);
}

function creatGauge(x: number, y: number, diameter: number, start: number, end: number, pointerColor: number, bgColor: number) {
    let cmd = creatCommand(CMD_OF_DRAW_GAUGE, CMD_OF_DRAW_GAUGE_LEN);
    cmd = cmd.concat([getID(CMD_OF_DRAW_GAUGE)]).concat(data16Tobyte(diameter)).concat(data16Tobyte(start)).concat(data16Tobyte(end)).concat(data24Tobyte(pointerColor)).concat(data24Tobyte(bgColor)).concat(data16Tobyte(x)).concat(data16Tobyte(y));
    writeCommand(cmd, CMD_OF_DRAW_GAUGE_LEN);
}

function updateGauge(id: number, x: number, y: number, diameter: number, start: number, end: number, pointerColor: number, bgColor: number) {
    let cmd = creatCommand(CMD_OF_DRAW_GAUGE, CMD_OF_DRAW_GAUGE_LEN);
    cmd = cmd.concat([id]).concat(data16Tobyte(diameter)).concat(data16Tobyte(start)).concat(data16Tobyte(end)).concat(data24Tobyte(pointerColor)).concat(data24Tobyte(bgColor)).concat(data16Tobyte(x)).concat(data16Tobyte(y));
    writeCommand(cmd, CMD_OF_DRAW_GAUGE_LEN);
}

function setGaugeValue(id: number, value: number) {
    let cmd = creatCommand(CMD_OF_DRAW_GAUGE_VALUE, CMD_SET_GAUGE_VALUE_LEN);
    cmd = cmd.concat([id]).concat(data16Tobyte(value));
    writeCommand(cmd, CMD_SET_GAUGE_VALUE_LEN);
}

function deleteGauge(id: number) {
    let cmd = creatCommand(CMD_DELETE_OBJ, CMD_DELETE_OBJ_LEN);
    cmd = cmd.concat([CMD_OF_DRAW_GAUGE, id]);
    writeCommand(cmd, CMD_DELETE_OBJ_LEN);
    deleteNodeByID(list.gaugeHead, id);
}

function creatLineMeter(x: number, y: number, size: number, start: number, end: number, pointerColor: number, bgColor: number) {
    let cmd = creatCommand(CMD_OF_DRAW_LINE_METER, CMD_OF_DRAW_LINE_METER_LEN);
    cmd = cmd.concat([getID(CMD_OF_DRAW_LINE_METER)]).concat(data16Tobyte(size)).concat(data16Tobyte(start)).concat(data16Tobyte(end)).concat(data24Tobyte(pointerColor)).concat(data24Tobyte(bgColor)).concat(data16Tobyte(x)).concat(data16Tobyte(y));
    writeCommand(cmd, CMD_OF_DRAW_LINE_METER_LEN);
}

function updateLineMeter(id: number, x: number, y: number, size: number, start: number, end: number, pointerColor: number, bgColor: number) {
    let cmd = creatCommand(CMD_OF_DRAW_LINE_METER, CMD_OF_DRAW_LINE_METER_LEN);
    cmd = cmd.concat([id]).concat(data16Tobyte(size)).concat(data16Tobyte(start)).concat(data16Tobyte(end)).concat(data24Tobyte(pointerColor)).concat(data24Tobyte(bgColor)).concat(data16Tobyte(x)).concat(data16Tobyte(y));
    writeCommand(cmd, CMD_OF_DRAW_LINE_METER_LEN);
}

function setTopLineMeter(id: number) {
    let cmd = creatCommand(CMD_SET_TOP_OBJ, CMD_SET_TOP_OBJ_LEN);
    cmd = cmd.concat([CMD_OF_DRAW_LINE_METER, id]);
    writeCommand(cmd, CMD_DELETE_OBJ_LEN);
}

function deleteLineMeter(id: number) {
    let cmd = creatCommand(CMD_DELETE_OBJ, CMD_DELETE_OBJ_LEN);
    cmd = cmd.concat([CMD_OF_DRAW_LINE_METER, id]);
    writeCommand(cmd, CMD_DELETE_OBJ_LEN);
    deleteNodeByID(list.lineMeterHead, id);
}

function creatChart(strX: string[], strY: string[], bgColor: number, type: number): number {
    let cmd = creatCommand(CMD_OF_DRAW_LINE_CHART, CMD_DRAW_CHART_LEN);
    let id = getID(CMD_OF_DRAW_LINE_CHART);
    cmd = cmd.concat([id, type]).concat(data24Tobyte(bgColor));
    writeCommand(cmd, CMD_DRAW_CHART_LEN);
    basic.pause(100);
    setChartAxisTexts(id, 0, strX);
    basic.pause(100);
    setChartAxisTexts(id, 1, strY);
    return id;
}

function updateChart(id: number, bgColor: number, type: number) {
    let cmd = creatCommand(CMD_OF_DRAW_LINE_CHART, CMD_DRAW_CHART_LEN);
    cmd = cmd.concat([id, type]).concat(data24Tobyte(bgColor));
    writeCommand(cmd, CMD_DRAW_CHART_LEN);
}

function creatChartSeries(chartId: number, color: number): number {
    let cmd = creatCommand(CMD_OF_DRAW_SERIE, CMD_DRAW_SERIE_LEN);
    let serieId = getID(CMD_OF_DRAW_SERIE);
    cmd = cmd.concat([serieId, chartId]).concat(data24Tobyte(color));
    writeCommand(cmd, CMD_DRAW_SERIE_LEN);
    return serieId;
}

function updateChartSeries(chartId: number, seriesId: number, color: number) {
    let cmd = creatCommand(CMD_OF_DRAW_SERIE, CMD_DRAW_SERIE_LEN);
    cmd = cmd.concat([seriesId, chartId]).concat(data24Tobyte(color));
    writeCommand(cmd, CMD_DRAW_SERIE_LEN);
}

function setChartAxisTexts(chartId: number, axis: number, text: string[]) {
    let len = text.length - 1;
    text.forEach((value, index) => { len = len + value.length });
    let cmd = creatCommand(CMD_OF_DRAW_LINE_CHART_TEXT, len + 6);
    cmd = cmd.concat([chartId, axis]);
    for (let i = 0; i < text.length; i++) {
        text[i].split("").forEach((value, index) => {
            cmd.push(value.charCodeAt(0))
        })
        if (i != text.length - 1) {
            cmd.push(0x0A); // "\n"
        }
    }
    writeCommand(cmd, len + 6);
}

function updateChartPoint(chartId: number, seriesId: number, pointNum: number, value: number) {
    let cmd = creatCommand(CMD_OF_DRAW_SERIE_DATA, 10);
    cmd = cmd.concat([chartId, seriesId, 1, pointNum]).concat(data16Tobyte(value));
    writeCommand(cmd, 10);
}

function addChartSeriesData(chartId: number, seriesId: number, point: number[], len: number): number {
    let cmd = creatCommand(CMD_OF_DRAW_SERIE_DATA, len * 2 + 8);
    cmd = cmd.concat([chartId, seriesId, 0, 0]);
    point.forEach((value, index) => { cmd = cmd.concat(data16Tobyte(value)) });
    writeCommand(cmd, len * 2 + 8);
    return 1;
}

function setTopChart(id: number) {
    let cmd = creatCommand(CMD_SET_TOP_OBJ, CMD_SET_TOP_OBJ_LEN);
    cmd = cmd.concat([CMD_OF_DRAW_LINE_CHART, id]);
    writeCommand(cmd, CMD_SET_TOP_OBJ_LEN);
}

function deleteChart(id: number) {
    let cmd = creatCommand(CMD_DELETE_OBJ, CMD_DELETE_OBJ_LEN);
    cmd = cmd.concat([CMD_OF_DRAW_LINE_CHART, id]);
    writeCommand(cmd, CMD_DELETE_OBJ_LEN);
    deleteNodeByID(list.lineChartHead, id);
}

function setMeterValue(lineMeterId: number, value: number) {
    let cmd = creatCommand(CMD_OF_DRAW_LINE_METER_VALUE, CMD_SET_LINE_METER_VALUE_LEN);
    cmd = cmd.concat([lineMeterId]).concat(data16Tobyte(value));
    writeCommand(cmd, CMD_SET_LINE_METER_VALUE_LEN);
}

/********************************************************************************************************************/
function creatList() {
    list.lineChartHead = new LinkedList();
    list.seriesHead = new LinkedList();
    list.compassHead = new LinkedList();
    list.textHead = new LinkedList();
    list.gaugeHead = new LinkedList();
    list.lineHead = new LinkedList();
    list.rectHead = new LinkedList();
    list.circleHead = new LinkedList();
    list.triangleHead = new LinkedList();
    list.lineMeterHead = new LinkedList();
    list.barHead = new LinkedList();
    list.sliderHead = new LinkedList();
    list.iconHead = new LinkedList();
    list.gifHead = new LinkedList();
}

function getID(type: number): number {
    let id = 0;
    switch (type) {
        case CMD_OF_DRAW_LINE_CHART:
            id = getNewID(list.lineChartHead);
            break;
        case CMD_OF_DRAW_SERIE:
            id = getNewID(list.seriesHead);
            break;
        case CMD_OF_DRAW_COMPASS:
            id = getNewID(list.compassHead);
            break;
        case CMD_OF_DRAW_TEXT:
            id = getNewID(list.textHead);
            break;
        case CMD_OF_DRAW_GAUGE:
            id = getNewID(list.gaugeHead);
            break;
        case CMD_OF_DRAW_LINE:
            id = getNewID(list.lineHead);
            break;
        case CMD_OF_DRAW_RECT:
            id = getNewID(list.rectHead);
            break;
        case CMD_OF_DRAW_TRIANGLE:
            id = getNewID(list.triangleHead);
            break;
        case CMD_OF_DRAW_CIRCLE:
            id = getNewID(list.circleHead);
            break;
        case CMD_OF_DRAW_LINE_METER:
            id = getNewID(list.lineMeterHead);
            break;
        case CMD_OF_DRAW_BAR:
            id = getNewID(list.barHead);
            break;
        case CMD_OF_DRAW_SLIDER:
            id = getNewID(list.sliderHead);
            break;
        case CMD_OF_DRAW_ICON_INTERNAL:
            id = getNewID(list.iconHead);
            break;
        case CMD_OF_DRAW_GIF_INTERNAL:
            id = getNewID(list.gifHead);
            break;
        default:
            break;
    }
    return id;
}

function getNewID(linkList: LinkedList): number {
    linkList.append();
    return linkList.head.id;
}

function deleteNodeByID(linkList: LinkedList, id: number) {
    linkList.removeId(id);
}

function data16Tobyte(data: number): number[] {
    return [(data >> 8) & 0xFF, data & 0xFF];
}

function data24Tobyte(data: number): number[] {
    return [(data >> 16) & 0xFF, (data >> 8) & 0xFF, data & 0xFF];
}

function colorToCustom(color: number): number {
    switch (color) {
        case 0x999999:
            return 0x696969;
        case 0x7f00ff:
            return 0x800080;
        default:
            return color;
    }
}

function creatCommand(cmd: number, len: number): number[] {
    return [CMD_HEADER_HIGH, CMD_HEADER_LOW, len - CMDLEN_OF_HEAD_LEN, cmd];
}

function writeCommand(data: number[], len: number) {
    // serial.writeNumbers(data);
    if (protocol == Protocol.IIC) {
        let remain = len;
        let i = 0;
        while (remain > 0) {
            let currentTransferSize = (remain > IIC_MAX_TRANSFER_SIZE) ? 32 : remain;
            if (remain > IIC_MAX_TRANSFER_SIZE) {
                pins.i2cWriteBuffer(address, pins.createBufferFromArray(data.slice(i * IIC_MAX_TRANSFER_SIZE, i * IIC_MAX_TRANSFER_SIZE + currentTransferSize)), true);
            } else {
                pins.i2cWriteBuffer(address, pins.createBufferFromArray(data.slice(i * IIC_MAX_TRANSFER_SIZE, i * IIC_MAX_TRANSFER_SIZE + currentTransferSize)), false);
            }
            remain = remain - currentTransferSize;
            i = i + 1;
        }
    } else {
    }
}

function readACK(length: number): Buffer {
    if (protocol == Protocol.IIC) {
        let remain = length;
        let buf: Buffer = pins.createBuffer(0);
        while (remain) {
            let currentTransferSize = (remain > IIC_MAX_TRANSFER_SIZE) ? IIC_MAX_TRANSFER_SIZE : remain;
            buf = buf.concat(pins.i2cReadBuffer(address, currentTransferSize));
            remain = remain - currentTransferSize;
        }
        return buf;
    } else {
        let buf: Buffer = pins.createBuffer(0);
        return buf;
    }
}

// --------------------------------------
// End of code from DFRobot lcdDisplay extension
// --------------------------------------


//% blockNamespace=storybrain
class StoryMessage {
    _sender: string;
    _message: string;

    constructor(sender: string, message: string) {
        this._sender = sender;
        this._message = message;
    }

    //% blockCombine
    get text() { return this._message }

    //% blockCombine
    get sender() { return this._sender }
}

//% color="#402504" icon="\uf02d" block="Story brain"
namespace storybrain {

    const ROOM_ELEMENT_IMAGE_CODE_UNKNOWN: string = 'def';

    /**
     * Information about an image for an escape room element.
     */
    class RoomElementImage {
        code: string;
        private _filename: string;

        /**
         * Constructs the image using 
         */
        constructor(code: string = null) {
            if (code === null) {
                this.code = ROOM_ELEMENT_IMAGE_CODE_UNKNOWN;
            } else {
                this.code = code;
            }
            this._filename = this.code.toLowerCase();
        }

        public getFilePath(fresh: boolean = true) {
            if (fresh) {
                return "/escape room icon/" + this._filename + "_mid.png";
            } else {
                return "/escape room icon/" + this._filename + "_dark.png";
            }

        }
    }

    class RoomElement {
        name: string;
        lastCheckInTime: number;  // Millis since power on.
        image: RoomElementImage;
        fresh: boolean;
        changedState: boolean;

        constructor(name: string, imageCode: string = null) {
            this.name = name;
            this.image = new RoomElementImage(imageCode);
            this.fresh = true;
            this.changedState = true;
            this.checkIn();
        }

        checkIn() {
            this.lastCheckInTime = control.millis();
            if (!this.fresh) {
                this.fresh = true;
                this.changedState = true;
            }
        }

        // Call after updating widget on screen.
        update() {
            this.changedState = false;
            if (this.fresh) {
                if (control.millis() - this.lastCheckInTime > 8000) {
                    this.fresh = false;
                    this.changedState = true;
                }
            }
        }
    }

    function getIconXPlacement(elementOrder: number) {
        switch (elementOrder) {
            case 0: return 2;
            case 1: return 2;
            case 2: return 2;
            case 3: return 2;
            case 4: return 2;
            case 5: return 2 + 45 * 1;
            case 6: return 2 + 45 * 2;
            case 7: return 2 + 45 * 3;
            case 8: return 2 + 45 * 4;
            case 9: return 2 + 45 * 5;
            case 10: return 2 + 45 * 6;
            case 11: return 2 + 45 * 6;
            case 12: return 2 + 45 * 6;
            case 13: return 2 + 45 * 6;
            case 14: return 2 + 45 * 6;
            case 15: return 2 + 45 * 5;
            case 16: return 2 + 45 * 4;
            case 17: return 2 + 45 * 3;
            case 18: return 2 + 45 * 2;
            case 19: return 2 + 45 * 1;
            default: return 0;
        }
    }

    function getIconYPlacement(elementOrder: number) {
        switch (elementOrder) {
            case 0: return 2;
            case 1: return 2 + 47 * 1;
            case 2: return 2 + 47 * 2;
            case 3: return 2 + 47 * 3;
            case 4: return 2 + 47 * 4;
            case 5: return 2 + 47 * 4;
            case 6: return 2 + 47 * 4;
            case 7: return 2 + 47 * 4;
            case 8: return 2 + 47 * 4;
            case 9: return 2 + 47 * 4;
            case 10: return 2 + 47 * 4;
            case 11: return 2 + 47 * 3;
            case 12: return 2 + 47 * 2;
            case 13: return 2 + 47 * 1;
            case 14: return 2;
            case 15: return 2;
            case 16: return 2;
            case 17: return 2;
            case 18: return 2;
            case 19: return 2;
            default: return 0;
        }
    }

    let roomName: string = 'UNNAMED'
    let brainInitialized: boolean = false;
    let startInitializationTime: number;
    let statusText: string = '';
    let statusColour: number = lcdGetRgbColor(255, 0, 0);
    let updatingScreen: boolean = false;
    const registeredElements: RoomElement[] = [];
    const uncheckedStoryMessages: StoryMessage[] = [];

    /**
     * Set up the story brain for the escape room.
     * @param room the unique name for the room (use a maximum of 4 regular letters)
     * @param radioGroup the radio group for the room, unique in the vicinity
    */
    //% block="initialise brain with room name $room and radio group $radioGroup"
    //% blockGap=50
    //% weight=100
    //% room.defl="room"
    //% radioGroup.min=0 radioGroup.max=255 radioGroup.defl=20
    export function initialiseBrain(room: string, radioGroup: number) {
        initialise(room, radioGroup);
    }

    /**
     * Returns true if there any unchecked messages available to grab.
    */
    //% block="unchecked messages available"
    //% weight=52
    export function uncheckedMessagesAvailable(): boolean {
        return (uncheckedStoryMessages.length > 0);
    }

    /**
     * Grab the next unchecked message, removing it from the inbox.
    */
    //% block="grab next unchecked message"
    //% weight=51
    //% blockSetVariable=storymessage
    export function grabNextUncheckedMessage(): StoryMessage {
        while (updatingScreen) {
            basic.pause(1);
        }
        if (uncheckedStoryMessages.length > 0) {
            return uncheckedStoryMessages.pop();
        }
        return new StoryMessage('no message', 'no message');
    }

    /**
     * Use the story brain's colour screen to display a short status message.
     */
    //% block="Display status $text in $colour"
    //% colour.shadow="colorNumberPicker"
    //% advanced=true
    //% weight=10
    export function setStatus(text: string, colour: number) {
        statusText = text;
        statusColour = colour;
    }

    /**
     * Clear status message on the story brain's colour screen.
     */
    //% block="Clear status"
    //% advanced=true
    //% weight=9
    export function clearStatus() {
        statusText = '';
    }

    // Ensures that an element is kept up to date in the registeredElements array.
    function registerElement(name: string, imageCode: string = null) {
        for (let element of registeredElements) {
            if (element.name.toUpperCase() === name) {
                element.checkIn();
                return;
            }
        }
        registeredElements.push(new RoomElement(name, imageCode));
    }

    // Capture and process all radio messages coming in as strings.
    /*
    / Check-in messages are formatted as follows:   [room name]*[element name]
    / Check-in messages can also be formatted to give an image:   [room name]*[element name]*I*[image code]
    / Trigger messages are formatted as follows:   [room name]*[element name]*[message]
    /
    / room name is a string of no more than 4 characters. Asterisk not allowed. Must be unique among all escape rooms in the vicinity.
    / element name is a string of no more than 4 characters. Asterisk not allowed. Must be unique among all elements in this escape room.
    / message is a string of no more than 9 characters. Asterisk not allowed.
    /
    / Case is always ignored when comparing, so names and IDs must be unique ignoring case.
    */
    radio.onReceivedString(function (receivedString: string) {
        if (!brainInitialized) {
            return;
        }

        let messageParts: string[] = receivedString.split('*');

        // If the received string could not be split, ignore it.
        if (messageParts.length <= 1) {
            return;
        }
        // If the room name doesn't match, ignore it.
        if (messageParts[0].toUpperCase() != roomName.toUpperCase()) {
            return;
        }
        // Process a basic check-in string.
        if (messageParts.length == 2) {
            registerElement(messageParts[1]);
            return;
        }
        // Process an advanced check-in string.
        if (messageParts.length == 4) {
            registerElement(messageParts[1], messageParts[3]);
            return;
        }
        registerElement(messageParts[1]);
        // Process a true story message, but ignore if there is already an unchecked message from that element.
        for (let message of uncheckedStoryMessages) {
            if (message.sender.toUpperCase() == messageParts[1].toUpperCase()) {
                return;
            }
        }
        uncheckedStoryMessages.unshift(new StoryMessage(messageParts[1], messageParts[2]));
    });

    // Sets up the story brain with a room name and radio group unique in the vicinity.
    // Must be called before other functions will work.
    function initialise(room: string, radioGroup: number) {
        roomName = room;
        radio.setGroup(radioGroup);
        lcdInitIIC();
        lcdClearAll();
        lcdSetBgcolor(lcdGetRgbColor(0, 0, 0));
        lcdDisplayImage(250, '/escape room icon/story_brain.png', 123, 71, 255);
        lcdDisplayText(roomName, 251, 123, 143, FontSize.Small, lcdGetRgbColor(255, 255, 255));
        startInitializationTime = control.millis();
    }

    // Test code
    /*
    registerElement('box', 'box');
    registerElement('btns', 'press');
    registerElement('hmmm');
    registerElement('tes2');
    registerElement('tes3');
    registerElement('tes4');
    registerElement('tes5');
    registerElement('tes6');
    registerElement('tes7');
    registerElement('tes8');
    registerElement('tes9');
    registerElement('tes10');
    registerElement('tes11');
    registerElement('tes12');
    registerElement('tes13');
    registerElement('tes14');
    registerElement('tes15');
    registerElement('tes16');
    registerElement('tes17');
    uncheckedStoryMessages.unshift(new StoryMessage('box', 'hello'));
    uncheckedStoryMessages.unshift(new StoryMessage('btns', 'yo'));
    uncheckedStoryMessages.unshift(new StoryMessage('hmmm', 'hi!'));
    */

    basic.forever(function () {
        basic.pause(200);

        if (!brainInitialized) {
            if (control.millis() - startInitializationTime > 2000) {
                brainInitialized = true;
            } else {
                return;
            }
        }

        // Update elements on screen.
        updatingScreen = true;
        for (let i = 0; i < registeredElements.length; i++) {
            let widgetOrder = (i + 1) * 3;
            if (registeredElements[i].changedState) {
                let path;
                let textColour;
                if (registeredElements[i].fresh) {
                    path = registeredElements[i].image.getFilePath();
                    textColour = lcdGetRgbColor(255, 255, 255)
                } else {
                    path = registeredElements[i].image.getFilePath(false);
                    textColour = lcdGetRgbColor(128, 128, 128)
                }
                lcdDisplayImage(widgetOrder, path, getIconXPlacement(i), getIconYPlacement(i), 255);
                basic.pause(5);  // Pause added to avoid overload in communication with screen.
                lcdDisplayText(registeredElements[i].name, widgetOrder + 1, getIconXPlacement(i) + 6, getIconYPlacement(i) + 46 - 2 - 18, FontSize.Small, textColour);
                basic.pause(5);  // Pause added to avoid overload in communication with screen.
            }
            // Draw a line if there is an unchecked message from that element.
            let lineToDraw = false;
            for (let message of uncheckedStoryMessages) {
                if (message.sender.toUpperCase() == registeredElements[i].name.toUpperCase()) {
                    lineToDraw = true;
                }
            }
            if (lineToDraw) {
                lcdDrawLine(widgetOrder + 2, getIconXPlacement(i) + 23, getIconYPlacement(i) + 23, 159, 119, 5, lcdGetRgbColor(0, 255, 0));
            } else {
                lcdDeleteWidget(LCDWidgetCategoryTwo.Line, widgetOrder + 2);
            }
            registeredElements[i].update();
            // Custom status display.
            if (statusText.length > 0) {
                lcdDisplayText(statusText, 200, 72, 166, FontSize.Small, statusColour);
            } else {
                lcdDeleteWidget(LCDWidgetCategoryTwo.Text, 200);
            }
        }
        updatingScreen = false;
    })

}
