// Describes what question indices is good to be different (according to Rufus), if you choose that you want a complimentary co-founder

export const differenceIndices = [
    17,
    28,
    30,
    31,
]

export function processSimilarityScores(similarityScores: number[], complementary: boolean) {
    if (complementary) {
        const adjustedScores = similarityScores.map((score, index) =>
            differenceIndices.includes(index) ? 1 - score : score
        );
        return adjustedScores.reduce((sum, score) => sum + score, 0) / adjustedScores.length;
    }
    return similarityScores.reduce((sum, score) => sum + score, 0) / similarityScores.length;
}