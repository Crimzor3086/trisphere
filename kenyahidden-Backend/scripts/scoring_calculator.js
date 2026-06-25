/**
 * KHC-DE Scoring Calculator
 * Computes Hidden Champion score (0–100) based on evidence inputs.
 * ESM module — import { calculateHiddenChampionScore } from './scoring_calculator.js'
 */

/**
 * Longevity score: 0–5 yrs → 5, 5–10 → 10, 10–20 → 15, 20+ → 20
 * @param {number} years
 * @returns {number}
 */
export function calculateLongevityScore(years) {
  if (years >= 20) return 20;
  if (years >= 10) return 15;
  if (years >= 5)  return 10;
  return 5;
}

/**
 * Customer trust score based on reviews and institutional references.
 * @param {number|null} reviewsRating
 * @param {number} reviewsCount
 * @param {number} institutionalRefs
 * @returns {number}
 */
export function calculateTrustScore(reviewsRating = null, reviewsCount = 0, institutionalRefs = 0) {
  let score = 0;

  if (reviewsCount >= 50 && reviewsRating >= 4.0) {
    score += 10;
  } else if (reviewsCount >= 20 && reviewsRating >= 4.0) {
    score += 6;
  } else if (reviewsCount >= 10) {
    score += 4;
  } else if (reviewsCount > 0) {
    score += 2;
  }

  // Institutional references boost
  score += Math.min(institutionalRefs * 2, 10);

  return Math.min(score, 20);
}

/**
 * Operational footprint score.
 * @param {number} branches
 * @param {number} warehouses
 * @param {string} distributionCoverage  'local' | 'regional' | 'national'
 * @returns {number}
 */
export function calculateOperationsScore(branches, warehouses, distributionCoverage = 'local') {
  let score = 0;
  score += Math.min(branches * 4, 12);   // up to 3 branches for max points
  score += Math.min(warehouses * 2, 4);  // warehouse facilities

  if (distributionCoverage === 'national') score += 4;
  else if (distributionCoverage === 'regional') score += 2;

  return Math.min(score, 20);
}

/**
 * Growth signals score.
 * @param {number}  newLocations
 * @param {boolean} hiringVisible
 * @param {boolean} exports
 * @param {number}  newProducts
 * @returns {number}
 */
export function calculateGrowthScore(newLocations, hiringVisible, exports_, newProducts) {
  let score = 0;
  score += newLocations * 4;
  if (hiringVisible) score += 6;
  if (exports_)      score += 6;
  score += Math.min(newProducts * 2, 4);
  return Math.min(score, 20);
}

/**
 * Ecosystem invisibility score (lower visibility = higher score).
 * @param {boolean} vcFunded
 * @param {boolean} acceleratorAlumni
 * @param {boolean} mediaFeatured
 * @param {boolean} linkedinHeavy
 * @param {boolean} isStartup
 * @returns {number}
 */
export function calculateVisibilityScore(vcFunded, acceleratorAlumni, mediaFeatured, linkedinHeavy, isStartup) {
  if (vcFunded || acceleratorAlumni || isStartup) return 0;

  let score = 20;
  if (mediaFeatured) score -= 10;
  if (linkedinHeavy) score -= 10;
  if (vcFunded)      score -= 20; // belt-and-suspenders (already caught above)

  return Math.max(0, score);
}

/**
 * Calculate the total Hidden Champion score and full breakdown.
 *
 * @param {object} params
 * @param {number}       params.yearsOperating
 * @param {number|null}  params.reviewsRating
 * @param {number}       params.reviewsCount
 * @param {number}       params.institutionalRefs
 * @param {number}       params.branches
 * @param {number}       params.warehouses
 * @param {string}       params.distributionCoverage
 * @param {number}       params.newLocations
 * @param {boolean}      params.hiringVisible
 * @param {boolean}      params.exports
 * @param {number}       params.newProducts
 * @param {boolean}      params.vcFunded
 * @param {boolean}      params.acceleratorAlumni
 * @param {boolean}      params.mediaFeatured
 * @param {boolean}      params.linkedinHeavy
 * @param {boolean}      params.isStartup
 * @returns {{ longevity_score, trust_score, operations_score, growth_score,
 *             invisibility_score, total_score, classification }}
 */
export function calculateHiddenChampionScore({
  yearsOperating = 0,
  reviewsRating = null,
  reviewsCount = 0,
  institutionalRefs = 0,
  branches = 0,
  warehouses = 0,
  distributionCoverage = 'local',
  newLocations = 0,
  hiringVisible = false,
  exports = false,
  newProducts = 0,
  vcFunded = false,
  acceleratorAlumni = false,
  mediaFeatured = false,
  linkedinHeavy = false,
  isStartup = false,
} = {}) {
  const longevity   = calculateLongevityScore(yearsOperating);
  const trust       = calculateTrustScore(reviewsRating, reviewsCount, institutionalRefs);
  const operations  = calculateOperationsScore(branches, warehouses, distributionCoverage);
  const growth      = calculateGrowthScore(newLocations, hiringVisible, exports, newProducts);
  const visibility  = calculateVisibilityScore(vcFunded, acceleratorAlumni, mediaFeatured, linkedinHeavy, isStartup);

  const total = longevity + trust + operations + growth + visibility;

  const classification =
    total >= 90 ? 'Exceptional'       :
    total >= 80 ? 'Hidden Champion'   :
    total >= 70 ? 'Emerging Champion' :
    total >= 60 ? 'Watchlist'         :
                  'Reject';

  return {
    longevity_score:    longevity,
    trust_score:        trust,
    operations_score:   operations,
    growth_score:       growth,
    invisibility_score: visibility,
    total_score:        total,
    classification,
  };
}

// ---------------------------------------------------------------------------
// Self-test when run directly:  node scripts/scoring_calculator.js
// ---------------------------------------------------------------------------
if (process.argv[1] === new URL(import.meta.url).pathname ||
    process.argv[1]?.replace(/\\/g, '/').endsWith('scripts/scoring_calculator.js')) {
  const result = calculateHiddenChampionScore({
    yearsOperating: 15,
    reviewsRating: 4.3,
    reviewsCount: 45,
    institutionalRefs: 3,
    branches: 2,
    warehouses: 1,
    distributionCoverage: 'national',
    newLocations: 1,
    hiringVisible: true,
    exports: true,
    newProducts: 2,
  });
  console.log(`Hidden Champion Score: ${result.total_score}/100 — ${result.classification}`);
  console.log(result);
}
