"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteTopic, saveTopic } from "@/features/question-bank/actions";
import type { TopicManagerData } from "@/features/question-bank/queries";
import { siteCopy } from "@/lib/copy/id";
import { PixelIcon } from "@/components/pixel";
import { CrudModal } from "./crud-modal";
import { DeleteButton } from "./delete-button";
import { MutationForm } from "./mutation-form";

const copy = siteCopy.questionBank;

function Field({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string;
}) {
  return (
    <label className="block space-y-1.5 text-sm font-semibold">
      <span>{label}</span>
      <input
        className="min-h-10 w-full border-2 border-border bg-background px-3 font-normal focus:outline-none focus:ring-2 focus:ring-link"
        defaultValue={defaultValue}
        maxLength={150}
        name={name}
        required
        type="text"
      />
    </label>
  );
}

function SubtestSelect({
  subtests,
  defaultValue,
}: {
  subtests: TopicManagerData["subtests"];
  defaultValue: string;
}) {
  return (
    <label className="block space-y-1.5 text-sm font-semibold">
      <span>{copy.parentSubtest}</span>
      <select
        className="min-h-10 w-full border-2 border-border bg-background px-3 font-normal focus:outline-none focus:ring-2 focus:ring-link"
        defaultValue={defaultValue}
        name="subtestId"
      >
        {subtests.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function TopicForm({
  topic,
  subtests,
  defaultSubtestId,
  onClose,
}: {
  topic?: TopicManagerData["topics"][number];
  subtests: TopicManagerData["subtests"];
  defaultSubtestId: string;
  onClose: () => void;
}) {
  return (
    <MutationForm
      action={saveTopic}
      buttonLabel={topic ? copy.editTopic : copy.addTopic}
      className="space-y-4"
      onSuccess={onClose}
    >
      {topic && <input name="id" type="hidden" value={topic.id} />}
      <SubtestSelect
        defaultValue={topic?.subtestId ?? defaultSubtestId}
        subtests={subtests}
      />
      <Field
        defaultValue={topic?.name ?? ""}
        label={copy.name}
        name="name"
      />
    </MutationForm>
  );
}

export function TopicsManager({
  topics,
  subtests,
  initialSubtestId,
}: {
  topics: TopicManagerData["topics"];
  subtests: TopicManagerData["subtests"];
  initialSubtestId?: string;
}) {
  const defaultSubtestId = subtests[0]?.id ?? "";
  const [selectedSubtestId, setSelectedSubtestId] = useState<string>(
    initialSubtestId && subtests.some((s) => s.id === initialSubtestId)
      ? initialSubtestId
      : "all",
  );

  const filteredTopics =
    selectedSubtestId === "all"
      ? topics
      : topics.filter((t) => t.subtestId === selectedSubtestId);

  return (
    <div>
      {/* Toolbar & Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <PixelIcon name="target" size={14} />
            <span>Filter Subtes:</span>
            <select
              aria-label={copy.filterBySubtest}
              className="min-h-9 border-2 border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-link"
              onChange={(e) => setSelectedSubtestId(e.target.value)}
              value={selectedSubtestId}
            >
              <option value="all">Semua Subtes ({topics.length})</option>
              {subtests.map((s) => {
                const count = topics.filter((t) => t.subtestId === s.id).length;
                return (
                  <option key={s.id} value={s.id}>
                    {s.name} ({count})
                  </option>
                );
              })}
            </select>
          </label>
          {selectedSubtestId !== "all" && (
            <button
              className="pixel-press border-2 border-border bg-muted px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-card"
              onClick={() => setSelectedSubtestId("all")}
              type="button"
            >
              Reset Filter
            </button>
          )}
          <span className="text-xs text-muted-foreground font-mono">
            {filteredTopics.length} topik
          </span>
        </div>

        {subtests.length > 0 ? (
          <CrudModal title={copy.addTopic} triggerLabel={`+ ${copy.addTopic}`}>
            {(onClose) => (
              <TopicForm
                defaultSubtestId={
                  selectedSubtestId !== "all" ? selectedSubtestId : defaultSubtestId
                }
                onClose={onClose}
                subtests={subtests}
              />
            )}
          </CrudModal>
        ) : null}
      </div>

      {/* Empty states */}
      {subtests.length === 0 ? (
        <p className="mt-4 border-2 border-border bg-muted p-4 text-sm">
          {copy.emptySubtests}
        </p>
      ) : topics.length === 0 ? (
        <p className="mt-4 border-2 border-border bg-muted p-4 text-sm">
          {copy.emptyTopics}
        </p>
      ) : filteredTopics.length === 0 ? (
        <div className="mt-4 border-2 border-border bg-muted p-4 text-sm space-y-2">
          <p>Belum ada topik pada subtes yang dipilih.</p>
          <button
            className="pixel-press border-2 border-border bg-card px-3 py-1 text-xs font-semibold text-foreground"
            onClick={() => setSelectedSubtestId("all")}
            type="button"
          >
            Tampilkan semua topik
          </button>
        </div>
      ) : (
        <div className="mt-3 overflow-x-auto border-2 border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-border bg-muted">
                <th className="px-4 py-3 text-left font-semibold">
                  {copy.subtests}
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  {copy.name}
                </th>
                <th className="px-4 py-3 text-right font-semibold">
                  {copy.questions}
                </th>
                <th className="px-4 py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-border bg-card">
              {filteredTopics.map((topic) => (
                <tr className="hover:bg-muted/40" key={topic.id}>
                  <td className="px-4 py-3 text-muted-foreground">
                    <button
                      className="hover:underline hover:text-foreground text-left"
                      onClick={() => setSelectedSubtestId(topic.subtestId)}
                      title="Filter topik berdasarkan subtes ini"
                      type="button"
                    >
                      {topic.subtestName}
                    </button>
                  </td>
                  <td className="px-4 py-3 font-medium">{topic.name}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <Link
                      className="font-medium underline underline-offset-2 hover:text-link"
                      href={`/dashboard/question-bank/questions?subtestId=${topic.subtestId}&topicId=${topic.id}`}
                      title={`Lihat ${topic.questionCount} soal di ${topic.name}`}
                    >
                      {topic.questionCount}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        className="inline-flex min-h-9 items-center gap-1.5 border-2 border-border bg-background px-3 text-xs font-semibold hover:bg-muted"
                        href={`/dashboard/question-bank/questions?subtestId=${topic.subtestId}&topicId=${topic.id}`}
                        title={`Lihat pertanyaan di topik ${topic.name}`}
                      >
                        <span>Lihat Soal</span>
                        <PixelIcon name="arrow-right" size={12} />
                      </Link>
                      <Link
                        className="inline-flex min-h-9 items-center border-2 border-border bg-background px-3 text-xs font-semibold hover:bg-muted"
                        href={`/dashboard/question-bank/topics/${topic.id}/lessons`}
                      >
                        Materi
                      </Link>
                      <CrudModal
                        title={copy.editTopic}
                        triggerClassName="inline-flex min-h-9 items-center border-2 border-border px-3 text-xs font-semibold hover:bg-muted"
                        triggerLabel={copy.edit}
                      >
                        {(onClose) => (
                          <TopicForm
                            defaultSubtestId={topic.subtestId}
                            onClose={onClose}
                            subtests={subtests}
                            topic={topic}
                          />
                        )}
                      </CrudModal>
                      <DeleteButton action={deleteTopic} id={topic.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
