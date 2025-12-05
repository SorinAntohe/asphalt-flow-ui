// Diacritics normalization map
const diacriticsMap: { [key: string]: string } = {
  'ă': 'a', 'â': 'a', 'î': 'i', 'ș': 's', 'ț': 't',
  'Ă': 'A', 'Â': 'A', 'Î': 'I', 'Ș': 'S', 'Ț': 'T',
  'á': 'a', 'à': 'a', 'ã': 'a', 'ä': 'a',
  'é': 'e', 'è': 'e', 'ë': 'e', 'ê': 'e',
  'í': 'i', 'ì': 'i', 'ï': 'i',
  'ó': 'o', 'ò': 'o', 'ö': 'o', 'ô': 'o',
  'ú': 'u', 'ù': 'u', 'ü': 'u', 'û': 'u',
};

// Normalize text by removing diacritics
export function normalizeDiacritics(text: string): string {
  return text.split('').map(char => diacriticsMap[char] || char).join('');
}

// Calculate Levenshtein distance for typo tolerance
export function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  
  if (m === 0) return n;
  if (n === 0) return m;
  
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + 1, // substitution
          dp[i - 1][j] + 1,     // deletion
          dp[i][j - 1] + 1      // insertion
        );
      }
    }
  }
  
  return dp[m][n];
}

// Fuzzy match with typo tolerance
export function fuzzyMatch(query: string, target: string, maxDistance: number = 2): boolean {
  const normalizedQuery = normalizeDiacritics(query.toLowerCase());
  const normalizedTarget = normalizeDiacritics(target.toLowerCase());
  
  // Exact substring match
  if (normalizedTarget.includes(normalizedQuery)) {
    return true;
  }
  
  // Word-by-word matching with typo tolerance
  const queryWords = normalizedQuery.split(/\s+/);
  const targetWords = normalizedTarget.split(/\s+/);
  
  return queryWords.every(queryWord => {
    return targetWords.some(targetWord => {
      // For short words, require closer match
      const allowedDistance = queryWord.length <= 3 ? 1 : maxDistance;
      return targetWord.includes(queryWord) || 
             levenshteinDistance(queryWord, targetWord.substring(0, queryWord.length + allowedDistance)) <= allowedDistance;
    });
  });
}

// Calculate relevance score (higher is better)
export function calculateRelevance(query: string, target: string, isRecent: boolean = false): number {
  const normalizedQuery = normalizeDiacritics(query.toLowerCase());
  const normalizedTarget = normalizeDiacritics(target.toLowerCase());
  
  let score = 0;
  
  // Exact match bonus
  if (normalizedTarget === normalizedQuery) {
    score += 100;
  }
  
  // Starts with bonus
  if (normalizedTarget.startsWith(normalizedQuery)) {
    score += 50;
  }
  
  // Contains bonus
  if (normalizedTarget.includes(normalizedQuery)) {
    score += 25;
  }
  
  // Word boundary match bonus
  const words = normalizedTarget.split(/\s+/);
  if (words.some(w => w.startsWith(normalizedQuery))) {
    score += 30;
  }
  
  // Recency bonus
  if (isRecent) {
    score += 15;
  }
  
  // Length similarity bonus (prefer shorter matches)
  const lengthDiff = Math.abs(normalizedTarget.length - normalizedQuery.length);
  score += Math.max(0, 20 - lengthDiff);
  
  return score;
}

export type SearchResultType = 'comenzi' | 'avize' | 'clienti' | 'vehicule' | 'loturi' | 'retete' | 'costuri' | 'angajati' | 'furnizori';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  route: string;
  icon: string;
  relevance: number;
  quickActions?: { label: string; action: string; icon?: string }[];
}

export const searchTypeConfig: Record<SearchResultType, { label: string; icon: string; color: string }> = {
  comenzi: { label: 'Comenzi', icon: 'ShoppingCart', color: 'text-blue-500' },
  avize: { label: 'Avize', icon: 'FileText', color: 'text-green-500' },
  clienti: { label: 'Clienți', icon: 'Users', color: 'text-purple-500' },
  vehicule: { label: 'Vehicule', icon: 'Truck', color: 'text-orange-500' },
  loturi: { label: 'Loturi', icon: 'Package', color: 'text-cyan-500' },
  retete: { label: 'Rețete', icon: 'BookOpen', color: 'text-pink-500' },
  costuri: { label: 'Costuri', icon: 'Calculator', color: 'text-yellow-500' },
  angajati: { label: 'Angajați', icon: 'UserCircle', color: 'text-indigo-500' },
  furnizori: { label: 'Furnizori', icon: 'Building', color: 'text-teal-500' },
};
