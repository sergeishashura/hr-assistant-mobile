import { EvaluationResponse } from "../types/chat";

export function buildHrMessage(result: EvaluationResponse): string {
  const { evaluation } = result;

  const finalComment = evaluation.llm_evaluation.final_comment?.trim();

  console.log(evaluation);

  const grammarErrors = evaluation.grammar_evaluation.errors;
  const grammarPart = grammarErrors.length
    ? `\n\n📝 Grammar notes:\n${grammarErrors
        .map(
          (e) =>
            `• ${e.message}${
              e.suggestions?.length
                ? ` → Suggestions: ${e.suggestions.join(", ")}`
                : ""
            }`
        )
        .join("\n")}`
    : "";

  const issues = evaluation.llm_evaluation.issues;
  const issuesPart = issues.length
    ? `\n\n⚠️ What could be improved:\n${issues
        .map((i) => `• ${i}`)
        .join("\n")}`
    : "";

  const missing = evaluation.llm_evaluation.missing_points;
  const missingPart = missing.length
    ? `\n\n❗ What should be added to make your answer stronger:\n${missing
        .map((m) => `• ${m}`)
        .join("\n")}`
    : "";

  const sim = evaluation.llm_evaluation.semantic_similarity;
  const similarityPart = `\n\n📊 Relevance to the question: ${(
    sim * 100
  ).toFixed(0)}%`;

  return (
    `💬 Answer analysis:\n${finalComment}` +
    issuesPart +
    missingPart +
    grammarPart +
    similarityPart
  ).trim();
}
