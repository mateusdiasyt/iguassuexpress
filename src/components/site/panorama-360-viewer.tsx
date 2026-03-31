"use client";

import { LoaderCircle, MoveHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Panorama360ViewerProps = {
  src: string;
  alt: string;
  className?: string;
  initialYaw?: number;
  initialPitch?: number;
  showHint?: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function Panorama360Viewer({
  src,
  alt,
  className,
  initialYaw = 0,
  initialPitch = 0,
  showHint = false,
}: Panorama360ViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let animationFrame = 0;
    let resizeObserver: ResizeObserver | null = null;
    let cleanupTexture: { dispose: () => void } | null = null;
    let cleanupMaterial: { dispose: () => void } | null = null;
    let cleanupGeometry: { dispose: () => void } | null = null;
    let cleanupRenderer: { dispose: () => void } | null = null;
    let rendererDom: HTMLCanvasElement | null = null;
    let mesh: import("three").Mesh | null = null;
    let removeListeners: (() => void) | undefined;

    setStatus("loading");
    setHasInteracted(false);
    setIsDragging(false);

    async function setupViewer() {
      const root = containerRef.current;
      if (!root) {
        return;
      }

      const THREE = await import("three");
      if (cancelled || !containerRef.current) {
        return;
      }

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(72, 1, 1, 1100);
      camera.position.set(0, 0, 0.1);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      cleanupRenderer = renderer;
      const canvas = renderer.domElement;
      rendererDom = canvas;
      canvas.className = "h-full w-full";
      canvas.style.touchAction = "none";

      root.innerHTML = "";
      root.appendChild(canvas);

      const geometry = new THREE.SphereGeometry(500, 72, 48);
      geometry.scale(-1, 1, 1);
      cleanupGeometry = geometry;
      const lookTarget = new THREE.Vector3();

      const pointerState = {
        isDown: false,
        startX: 0,
        startY: 0,
        startYaw: initialYaw,
        startPitch: initialPitch,
      };

      const view = {
        yaw: initialYaw,
        pitch: initialPitch,
        targetYaw: initialYaw,
        targetPitch: initialPitch,
      };

      function resize() {
        const currentRoot = containerRef.current;
        if (!currentRoot) {
          return;
        }

        const width = currentRoot.clientWidth;
        const height = currentRoot.clientHeight;

        camera.aspect = width / Math.max(height, 1);
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      }

      function renderFrame() {
        view.yaw += (view.targetYaw - view.yaw) * 0.14;
        view.pitch += (view.targetPitch - view.pitch) * 0.14;

        const phi = THREE.MathUtils.degToRad(90 - view.pitch);
        const theta = THREE.MathUtils.degToRad(view.yaw);
        lookTarget.set(
          500 * Math.sin(phi) * Math.cos(theta),
          500 * Math.cos(phi),
          500 * Math.sin(phi) * Math.sin(theta),
        );

        camera.lookAt(lookTarget);
        renderer.render(scene, camera);
        animationFrame = window.requestAnimationFrame(renderFrame);
      }

      function handlePointerDown(event: PointerEvent) {
        pointerState.isDown = true;
        pointerState.startX = event.clientX;
        pointerState.startY = event.clientY;
        pointerState.startYaw = view.targetYaw;
        pointerState.startPitch = view.targetPitch;
        canvas.setPointerCapture?.(event.pointerId);
        setIsDragging(true);
        setHasInteracted(true);
      }

      function handlePointerMove(event: PointerEvent) {
        if (!pointerState.isDown || !containerRef.current) {
          return;
        }

        const rect = containerRef.current.getBoundingClientRect();
        const deltaX = ((event.clientX - pointerState.startX) / rect.width) * 160;
        const deltaY = ((event.clientY - pointerState.startY) / rect.height) * 110;

        view.targetYaw = pointerState.startYaw - deltaX;
        view.targetPitch = clamp(pointerState.startPitch + deltaY, -65, 65);
      }

      function handlePointerUp(event: PointerEvent) {
        pointerState.isDown = false;
        canvas.releasePointerCapture?.(event.pointerId);
        setIsDragging(false);
      }

      function handlePointerLeave() {
        pointerState.isDown = false;
        setIsDragging(false);
      }

      canvas.addEventListener("pointerdown", handlePointerDown);
      canvas.addEventListener("pointermove", handlePointerMove);
      canvas.addEventListener("pointerup", handlePointerUp);
      canvas.addEventListener("pointercancel", handlePointerUp);
      canvas.addEventListener("pointerleave", handlePointerLeave);

      resizeObserver = new ResizeObserver(() => resize());
      resizeObserver.observe(root);
      resize();

      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin("anonymous");
      loader.load(
        src,
        (texture: import("three").Texture) => {
          if (cancelled) {
            texture.dispose();
            return;
          }

          texture.colorSpace = THREE.SRGBColorSpace;
          texture.minFilter = THREE.LinearFilter;
          cleanupTexture = texture;

          const material = new THREE.MeshBasicMaterial({ map: texture });
          cleanupMaterial = material;
          mesh = new THREE.Mesh(geometry, material);
          scene.add(mesh);
          setStatus("ready");
        },
        undefined,
        () => {
          if (!cancelled) {
            setStatus("error");
          }
        },
      );

      renderFrame();

      return () => {
        canvas.removeEventListener("pointerdown", handlePointerDown);
        canvas.removeEventListener("pointermove", handlePointerMove);
        canvas.removeEventListener("pointerup", handlePointerUp);
        canvas.removeEventListener("pointercancel", handlePointerUp);
        canvas.removeEventListener("pointerleave", handlePointerLeave);
      };
    }

    void setupViewer().then((cleanup) => {
      removeListeners = cleanup;
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      removeListeners?.();
      if (mesh) {
        mesh.removeFromParent();
      }
      cleanupTexture?.dispose();
      cleanupMaterial?.dispose();
      cleanupGeometry?.dispose();
      cleanupRenderer?.dispose();

      if (rendererDom?.parentNode) {
        rendererDom.parentNode.removeChild(rendererDom);
      }
    };
  }, [initialPitch, initialYaw, src]);

  return (
    <div
      className={cn(
        "group/panorama relative overflow-hidden rounded-[inherit] bg-[#08111c]",
        isDragging ? "cursor-grabbing" : "cursor-grab",
        className,
      )}
      role="img"
      aria-label={alt}
    >
      <div ref={containerRef} className="absolute inset-0" />

      {status !== "ready" ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_28%),linear-gradient(180deg,rgba(8,17,28,0.82),rgba(8,17,28,0.94))] text-center">
          <div className="space-y-3 px-6">
            {status === "error" ? (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/58">
                  Panorama indisponivel
                </p>
                <p className="text-sm leading-7 text-white/76">
                  Nao foi possivel carregar esta foto 360. Tente outra cena.
                </p>
              </>
            ) : (
              <>
                <LoaderCircle className="mx-auto h-6 w-6 animate-spin text-white/70" />
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/58">
                  Carregando panorama 360
                </p>
              </>
            )}
          </div>
        </div>
      ) : null}

      {showHint ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center pt-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-slate-950/34 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/78 backdrop-blur-md">
            <MoveHorizontal className="h-3.5 w-3.5" />
            {hasInteracted ? "Panorama 360 ativo" : "Arraste para olhar em 360"}
          </span>
        </div>
      ) : null}
    </div>
  );
}
