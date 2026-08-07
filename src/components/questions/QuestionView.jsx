import ChoiceQuestion from "./ChoiceQuestion.jsx";
import MatchingQuestion from "./MatchingQuestion.jsx";
import OrderingQuestion from "./OrderingQuestion.jsx";

const RENDERERS = {
  choice: ChoiceQuestion,
  fill: ChoiceQuestion,
  matching: MatchingQuestion,
  ordering: OrderingQuestion,
};

/** 問題の type に応じた出題コンポーネントへ振り分ける。 */
export default function QuestionView({ q, onResult, onNext }) {
  const Renderer = RENDERERS[q.type];
  if (!Renderer) {
    return <p className="text-rose-300 text-sm">未対応の問題形式です: {q.type}</p>;
  }
  return <Renderer key={q.id} q={q} onResult={onResult} onNext={onNext} />;
}
