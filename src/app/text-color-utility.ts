export function getTextClass(colour: string) {
    colour = colour.replace("#", "");
    var r = parseInt(colour.substr(0,2),16);
    var g = parseInt(colour.substr(2,2),16);
    var b = parseInt(colour.substr(4,2),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? '' : 'text-white';
}