/**
 * Запускає періодичне оновлення астрономічних даних.
 * @param cb колбек для перерахунку напрямків
 * @param minutes інтервал у хвилинах
 */
export function startAstroTimer(
    cb: () => void,
    minutes = 10
) {
    cb(); // одразу
    const id = setInterval(cb, minutes * 60 * 1000);
    return () => clearInterval(id);
}
