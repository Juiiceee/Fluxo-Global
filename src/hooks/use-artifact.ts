"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

export type ArtifactKind = "text" | "code" | "image" | "sheet";

export interface UIArtifact {
	title: string;
	documentId: string;
	kind: ArtifactKind;
	content: string;
	isVisible: boolean;
	status: "streaming" | "idle";
	boundingBox: {
		top: number;
		left: number;
		width: number;
		height: number;
	};
}

export const initialArtifactData: UIArtifact = {
	documentId: "init",
	content: "",
	kind: "text",
	title: "",
	status: "idle",
	isVisible: false,
	boundingBox: {
		top: 0,
		left: 0,
		width: 0,
		height: 0,
	},
};

type Selector<T> = (state: UIArtifact) => T;

export function useArtifactSelector<Selected>(selector: Selector<Selected>) {
	const { data: localArtifact } = useQuery({
		queryKey: ["artifact"],
		queryFn: () => initialArtifactData,
		initialData: initialArtifactData,
		staleTime: Infinity, // Never refetch for client state
	});

	const selectedValue = useMemo(() => {
		if (!localArtifact) return selector(initialArtifactData);
		return selector(localArtifact);
	}, [localArtifact, selector]);

	return selectedValue;
}

export function useArtifact() {
	const queryClient = useQueryClient();

	const { data: localArtifact } = useQuery({
		queryKey: ["artifact"],
		queryFn: () => initialArtifactData,
		initialData: initialArtifactData,
		staleTime: Infinity, // Never refetch for client state
	});

	const artifact = useMemo(() => {
		if (!localArtifact) return initialArtifactData;
		return localArtifact;
	}, [localArtifact]);

	const setArtifact = useCallback(
		(updaterFn: UIArtifact | ((currentArtifact: UIArtifact) => UIArtifact)) => {
			queryClient.setQueryData(["artifact"], (currentArtifact: UIArtifact) => {
				const artifactToUpdate = currentArtifact || initialArtifactData;

				if (typeof updaterFn === "function") {
					return updaterFn(artifactToUpdate);
				}

				return updaterFn;
			});
		},
		[queryClient]
	);

	const { data: localArtifactMetadata } = useQuery({
		queryKey: ["artifact-metadata", artifact.documentId],
		queryFn: () => null,
		initialData: null,
		staleTime: Infinity,
		enabled: !!artifact.documentId,
	});

	const setMetadata = useCallback(
		(metadata: any) => {
			if (artifact.documentId) {
				queryClient.setQueryData(["artifact-metadata", artifact.documentId], metadata);
			}
		},
		[queryClient, artifact.documentId]
	);

	return useMemo(
		() => ({
			artifact,
			setArtifact,
			metadata: localArtifactMetadata,
			setMetadata,
		}),
		[artifact, setArtifact, localArtifactMetadata, setMetadata]
	);
}
