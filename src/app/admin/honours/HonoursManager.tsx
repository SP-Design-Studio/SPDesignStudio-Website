"use client";
import { useSaving } from "@/lib/admin/saving";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { Honour } from "@/lib/cms/types";
import {
  createHonour,
  updateHonour,
  deleteHonour,
  reorderHonours,
} from "./actions";
import { useDirty } from "@/lib/admin/useDirty";
import { ui } from "@/lib/admin/ui";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { useFlash } from "@/lib/admin/useFlash";
import { EmptyState } from "@/components/admin/EmptyState";
import { SearchBox } from "@/components/admin/SearchBox";
import { DragHandle } from "@/components/admin/DragHandle";
import { useSearch } from "@/lib/admin/useSearch";
import { useDragReorder } from "@/lib/admin/useDragReorder";

function Card({
  item,
  index,
  total,
  onMove,
  reorderable = true,
}: {
  item: Honour;
  index: number;
  total: number;
  onMove: (dir: -1 | 1) => void;
  reorderable?: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: item.title,
    year: item.year ?? "",
    by_line: item.by_line ?? "",
    description: item.description ?? "",
    img: item.img,
  });
  const [pending, start] = useSaving();
  const [msg, flash] = useFlash();
  const { dirty, markSaved } = useDirty(form);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [form.description]);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const save = () =>
    start(async () => {
      const res = await updateHonour(item.id, {
        ...form,
        year: form.year || null,
        by_line: form.by_line || null,
        description: form.description || null,
      });
      flash(res.error ?? "Saved");
      if (!res.error) markSaved();
      router.refresh();
    });
  const remove = () =>
    start(async () => {
      await deleteHonour(item.id);
      router.refresh();
    });

  return (
    <div data-busy={pending || undefined} className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-4 rounded-sm border border-cream/10 bg-plum/20 p-4 transition-colors hover:border-cream/25">
      <ImageUploader
        value={form.img}
        onChange={(url) => set("img", url)}
        folder="honours"
        aspect="aspect-[3/2]"
      />
      <div className="flex flex-col gap-3">
        <label>
          <div className={ui.label}>Title</div>
          <input
            className={ui.input}
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label>
            <div className={ui.label}>Year</div>
            <input
              className={ui.input}
              value={form.year}
              placeholder="2024"
              onChange={(e) => set("year", e.target.value)}
            />
          </label>
          <label>
            <div className={ui.label}>By-line</div>
            <input
              className={ui.input}
              value={form.by_line}
              placeholder="The Studio"
              onChange={(e) => set("by_line", e.target.value)}
            />
          </label>
        </div>
        <label>
          <div className={ui.label}>Description</div>
          <textarea
            ref={textareaRef}
            rows={2}
            className={`${ui.input} resize-none overflow-hidden min-h-[44px]`}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </label>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-1">
						{reorderable && <DragHandle label="honour" />}
            <button
              aria-label="Move up"
              type="button"
              disabled={index === 0 || !reorderable}
              onClick={() => onMove(-1)}
              className="cursor-pointer border border-cream/20 px-2 py-1 text-cream/82 text-sm disabled:opacity-30 hover:border-gold hover:text-gold"
            >
              ↑
            </button>
            <button
              aria-label="Move down"
              type="button"
              disabled={index === total - 1 || !reorderable}
              onClick={() => onMove(1)}
              className="cursor-pointer border border-cream/20 px-2 py-1 text-cream/82 text-sm disabled:opacity-30 hover:border-gold hover:text-gold"
            >
              ↓
            </button>
          </div>
          <div className="flex items-center gap-3">
            {msg && (
              <span className="font-sans font-light text-cream/80 text-sm">
                {msg}
              </span>
            )}
            <ConfirmButton
            	label="Delete"
            	onConfirm={remove}
            	disabled={pending}
            />
            <button
              type="button"
              onClick={save}
              disabled={pending || !dirty}
              className="cta-gold cursor-pointer bg-gold px-5 py-2 font-sans font-light uppercase tracking-[0.22em] text-plum-dark text-tiny disabled:opacity-60"
            >
              {pending ? "…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HonoursManager({ initial }: { initial: Honour[] }) {
  const router = useRouter();
  const [list, setList] = useState(initial);
  const [pending, start] = useSaving();

  useEffect(() => {
    setList(initial);
  }, [initial]);

  const persist = (next: Honour[]) => {
  	setList(next);
  	start(async () => {
  		await reorderHonours(next.map((x) => x.id));
  		router.refresh();
  	});
  };

  const move = (i: number, dir: -1 | 1) => {
  	const next = [...list];
  	const j = i + dir;
  	if (j < 0 || j >= next.length) return;
  	[next[i], next[j]] = [next[j], next[i]];
  	persist(next);
  };

  const search = useSearch(list, (h) => [h.year, h.title, h.by_line, h.description]);
  const drag = useDragReorder(list, persist);

  return (
    <div className="flex flex-col gap-5">
      {list.length > 4 && (
        <SearchBox
          value={search.q}
          onChange={search.setQ}
          shown={search.shown.length}
          total={list.length}
          noun="honours"
          placeholder="Search year, title or text…"
        />
      )}
      {list.length === 0 && (
        <EmptyState
          title="No honours yet"
          body="Honours &amp; Milestones on the About page. Add awards and recognition, each with a year and image."
        />
      )}
      {search.active && search.shown.length === 0 && (
      	<p className="rounded-sm border border-dashed border-cream/15 px-4 py-8 text-center font-sans font-light text-cream/80 text-tiny">
      		No honours match &ldquo;{search.q.trim()}&rdquo;.
      	</p>
      )}
      {search.shown.map((item, i) => (
        <div
          key={item.id}
          {...(search.active ? {} : drag.handlers(i))}
          className={search.active ? "" : drag.itemClass(i)}>
          <Card
            item={item}
            index={i}
            total={list.length}
            onMove={(dir) => move(i, dir)}
            reorderable={!search.active}
          />
        </div>
      ))}
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            await createHonour();
            router.refresh();
          })
        }
        className="w-fit cursor-pointer border border-gold/40 px-6 py-3 font-sans font-light uppercase tracking-[0.24em] text-gold text-tiny hover:bg-gold/10 disabled:opacity-60"
      >
        {pending ? "Adding…" : "+ Add milestone"}
      </button>
    </div>
  );
}
