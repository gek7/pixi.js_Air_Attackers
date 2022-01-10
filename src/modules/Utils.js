/**
 * Функция переводит угол из градусов в радианы
 */
const celsiusToRadian = (celsius) => {
    return celsius * Math.PI / 180;
};

/**
 * Функция переводит угол из радиан в градусы
 */
const radianToCelsius = (radian) => {
    return 180 / Math.PI * radian;
};

/**
 * Функция высчитывает по координатам двух точек угол между ними
 */
const calculateAngle = (x1, y1, x2, y2) => {
    let subX = x1 - x2;
    let subY = y1 - y2;
    return Math.atan2(subY, subX);
};

/**
 * Проверка, что объект a соприкасается с объектом b
 * @param {* extends PIXI.DisplayObject} a 
 * @param {* extends PIXI.DisplayObject} b 
 * @returns объект A соприкасается с объектом B?
 */
const boxesIntersect = (a, b) => {
    var ab = a.getBounds();
    var bb = b.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
};

export { celsiusToRadian, radianToCelsius, calculateAngle, boxesIntersect };