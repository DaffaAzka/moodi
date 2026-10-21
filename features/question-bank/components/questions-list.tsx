"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { deleteQuestion } from "@/features/question-bank/actions";
import {
  QUESTION_PAGE_SIZE,
  type QuestionFiltersData,
  type QuestionListItem,
} from "@/features/question-bank/queries";
import { siteCopy } from "@/lib/copy/id";
import { PixelIcon } from "@/components/pixel";
import { MutationForm } from "./mutation-form";

const copy = siteCopy.questionBank;

function QuestionPreview({ value }: { value: string }) {
  try {
    const parsed: unknown = JSON.parse(value);
    const collectText = (node: unknown): string => {
      if (!node || typeof node !== "object") return "";
      const record = node as Record<string, unknown>;
      if (record.type === "text" && typeof record.text === "string") {
        return record.text;
      }
      if (
        (record.type === "inlineMath" || record.type === "blockMath") &&
        record.attrs &&
        typeof record.attrs === "object" &&
        "latex" in record.attrs &&
        typeof record.attrs.latex === "string"
      ) {
        return `$${record.attrs.latex}$`;
      }
      if (Array.isArray(record.content)) {
        return record.content.map(collectText).join(" ");
      }
      return "";
    };

    return collectText(parsed) || copy.editorPlaceholder;
  } catch {
    return value;
  }
}

export function QuestionsList({
  questions,
  page,
  hasNextPage,
  totalCount,
  filtersData,
  selectedSubtestId,
  selectedTopicId,
}: {
  questions: QuestionListItem[];
  page: number;
  hasNextPage: boolean;
  totalCount?: number;
  filtersData: QuestionFiltersData;
  selectedSubtestId?: string;
  selectedTopicId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Find available topics based on selected subtest
  const currentSubtest = selectedSubtestId
    ? filtersData.find((s) => s.id === selectedSubtestId)
    : null;

  const availableTopics = currentSubtest
    ? currentSubtest.topics
    : filtersData.flatMap((s) => s.topics);

  function handleSubtestChange(subtestIdVal: string) {
    const params = new URLSearchParams();
    if (subtestIdVal !== "all") {
      params.set("subtestId", subtestIdVal);
      // Keep topic if it belongs to selected subtest
      const subtestObj = filtersData.find((s) => s.id === subtestIdVal);
      if (
        selectedTopicId &&
        subtestObj?.topics.some((t) => t.id === selectedTopicId)
      ) {
        params.set("topicId", selectedTopicId);
      }
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function handleTopicChange(topicIdVal: string) {
    const params = new URLSearchParams();
    if (topicIdVal !== "all") {
      params.set("topicId", topicIdVal);
      const parentSubtest = filtersData.find((s) =>
        s.topics.some((t) => t.id === topicIdVal),
      );
      if (parentSubtest) {
        params.set("subtestId", parentSubtest.id);
      }
    } else if (selectedSubtestId) {
      params.set("subtestId", selectedSubtestId);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function handleResetFilters() {
    router.push(pathname);
  }

  const buildPageHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (targetPage > 1) params.set("page", String(targetPage));
    if (selectedSubtestId) params.set("subtestId", selectedSubtestId);
    if (selectedTopicId) params.set("topicId", selectedTopicId);
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  const hasActiveFilters = Boolean(selectedSubtestId || selectedTopicId);

  return (
    <>
      {/* Filters Bar */}
      <div className="mt-6 flex flex-col gap-3 border-2 border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {/* Subtest filter */}
          <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <PixelIcon name="target" size={14} />
            <span>Subtes:</span>
            <select
              aria-label={copy.filterBySubtest}
              className="min-h-9 border-2 border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-link"
              onChange={(e) => handleSubtestChange(e.target.value)}
              value={selectedSubtestId ?? "all"}
            >
              <option value="all">{copy.allSubtests}</option>
              {filtersData.map((s) => {
                const qCount = s.topics.reduce(
                  (acc, t) => acc + t._count.questions,
                  0,
                );
                return (
                  <option key={s.id} value={s.id}>
                    {s.name} ({qCount})
                  </option>
                );
              })}
            </select>
          </label>

          {/* Topic filter */}
          <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <span>Topik:</span>
            <select
              aria-label={copy.filterByTopic}
              className="min-h-9 border-2 border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-link"
              onChange={(e) => handleTopicChange(e.target.value)}
              value={selectedTopicId ?? "all"}
            >
              <option value="all">{copy.allTopics}</option>
              {availableTopics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t._count.questions})
                </option>
              ))}
            </select>
          </label>

          {/* Reset button if active */}
          {hasActiveFilters && (
            <button
              className="pixel-press border-2 border-border bg-muted px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-card"
              onClick={handleResetFilters}
              type="button"
            >
              {copy.resetFilter}
            </button>
          )}
        </div>

        <div className="text-xs font-mono text-muted-foreground">
          {totalCount !== undefined
            ? `${totalCount} pertanyaan`
            : `${questions.length} pertanyaan`}
        </div>
      </div>

      {!questions.length ? (
        <div className="mt-6 border-2 border-border bg-muted p-6 text-center space-y-3">
          <p className="text-sm font-medium">
            {hasActiveFilters
              ? "Tidak ada pertanyaan yang sesuai dengan filter yang dipilih."
              : copy.emptyQuestions}
          </p>
          {hasActiveFilters && (
            <button
              className="pixel-press border-2 border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground"
              onClick={handleResetFilters}
              type="button"
            >
              Tampilkan semua pertanyaan
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {questions.map((question, index) => (
            <article
              className="flex flex-col gap-4 border-2 border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
              key={question.id}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                  <button
                    className="font-semibold underline underline-offset-2 hover:text-foreground text-left"
                    onClick={() =>
                      handleSubtestChange(question.topic.subtest.id)
                    }
                    title={`Filter pertanyaan pada subtes ${question.topic.subtest.name}`}
                    type="button"
                  >
                    {question.topic.subtest.name}
                  </button>
                  <span>/</span>
                  <button
                    className="font-medium underline underline-offset-2 hover:text-foreground text-left"
                    onClick={() => handleTopicChange(question.topic.id)}
                    title={`Filter pertanyaan pada topik ${question.topic.name}`}
                    type="button"
                  >
                    {question.topic.name}
                  </button>
                  <span>·</span>
                  <span
                    className={
                      question.isPublished
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground italic"
                    }
                  >
                    {question.isPublished
                      ? copy.statusPublished
                      : copy.statusDraft}
                  </span>
                </div>

                <p className="mt-1 line-clamp-2 font-medium">
                  {copy.questionNumber}{" "}
                  {(page - 1) * QUESTION_PAGE_SIZE + index + 1}:{" "}
                  {QuestionPreview({ value: question.stem })}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {question._count.options} {copy.optionCount} ·{" "}
                  {copy.difficulty} {question.difficulty}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  className="inline-flex min-h-10 items-center border-2 border-border bg-background px-3 text-xs font-semibold hover:bg-muted"
                  href={`/dashboard/question-bank/topics/${question.topic.id}/lessons`}
                  title={`Lihat materi topik ${question.topic.name}`}
                >
                  Materi
                </Link>
                <Link
                  className="inline-flex min-h-10 items-center border-2 border-border px-3 text-sm font-semibold hover:bg-muted"
                  href={`/dashboard/question-bank/questions/${question.id}/edit`}
                >
                  {copy.edit}
                </Link>
                <MutationForm
                  action={deleteQuestion}
                  buttonLabel={copy.delete}
                  className="flex items-center"
                  destructive
                >
                  <input name="id" type="hidden" value={question.id} />
                </MutationForm>
              </div>
            </article>
          ))}
        </div>
      )}

      {(page > 1 || hasNextPage) && (
        <nav
          aria-label={copy.questionsPagination}
          className="mt-6 flex justify-between"
        >
          {page > 1 ? (
            <Link
              className="inline-flex min-h-11 items-center border-2 border-border px-4 font-semibold hover:bg-muted"
              href={buildPageHref(page - 1)}
            >
              {copy.previousPage}
            </Link>
          ) : (
            <span />
          )}
          {hasNextPage && (
            <Link
              className="inline-flex min-h-11 items-center border-2 border-border px-4 font-semibold hover:bg-muted"
              href={buildPageHref(page + 1)}
            >
              {copy.nextPage}
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
