import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Brief, ScaleId, VocalId } from "@/lib/brief";

export type Session = {
  id: string;
  savedAt: number;
  title: string;
  lyrics: string;
  vocal: VocalId;
  scale: ScaleId;
  brief: Brief;
};

type BoothState = {
  title: string;
  lyrics: string;
  vocal: VocalId;
  scale: ScaleId;
  shelf: Session[];
  activeId: string | null;
  setTitle: (title: string) => void;
  setLyrics: (lyrics: string) => void;
  setVocal: (vocal: VocalId) => void;
  setScale: (scale: ScaleId) => void;
  pushSession: (brief: Brief) => void;
  openSession: (id: string) => void;
  removeSession: (id: string) => void;
  loadSample: (sample: {
    title: string;
    lyrics: string;
    vocal: VocalId;
    scale: ScaleId;
  }) => void;
  clearPage: () => void;
};

export const useBooth = create<BoothState>()(
  persist(
    (set) => ({
      title: "",
      lyrics: "",
      vocal: "decide",
      scale: "decide",
      shelf: [],
      activeId: null,
      setTitle: (title) => set({ title }),
      setLyrics: (lyrics) => set({ lyrics }),
      setVocal: (vocal) => set({ vocal }),
      setScale: (scale) => set({ scale }),
      pushSession: (brief) =>
        set((state) => {
          const title = state.title.trim();
          const lyrics = state.lyrics.trim();
          const session: Session = {
            id: crypto.randomUUID(),
            savedAt: Date.now(),
            title,
            lyrics,
            vocal: state.vocal,
            scale: state.scale,
            brief: title ? { ...brief, workingTitle: title } : brief,
          };
          const shelf = [
            session,
            ...state.shelf.filter(
              (item) =>
                !(
                  item.lyrics === lyrics &&
                  item.vocal === state.vocal &&
                  item.scale === state.scale &&
                  item.title === title
                ),
            ),
          ].slice(0, 12);
          return { shelf, activeId: session.id };
        }),
      openSession: (id) =>
        set((state) => {
          const session = state.shelf.find((item) => item.id === id);
          if (!session) return state;
          return {
            activeId: session.id,
            title: session.title,
            lyrics: session.lyrics,
            vocal: session.vocal,
            scale: session.scale,
          };
        }),
      removeSession: (id) =>
        set((state) => ({
          shelf: state.shelf.filter((item) => item.id !== id),
          activeId: state.activeId === id ? null : state.activeId,
        })),
      loadSample: (sample) =>
        set({
          title: sample.title,
          lyrics: sample.lyrics,
          vocal: sample.vocal,
          scale: sample.scale,
          activeId: null,
        }),
      clearPage: () =>
        set({
          title: "",
          lyrics: "",
          vocal: "decide",
          scale: "decide",
          activeId: null,
        }),
    }),
    {
      name: "booth-desk-v1",
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        title: state.title,
        lyrics: state.lyrics,
        vocal: state.vocal,
        scale: state.scale,
        shelf: state.shelf,
        activeId: state.activeId,
      }),
    },
  ),
);
