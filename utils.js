
// RANDOM

/**
 * E.g. randomDiversity(10, 5) => [5, 15]
 *
 * @param standard Middle of the range
 * @param diversity ± this value
 */
function randomDiversity(standard, diversity) {
  return randomRange(standard - diversity, standard + diversity);
}

function randomRange(min, max) {
  return min + Math.random() * (max-min);
}
