"use client";

import { cn } from "@befday-2.0/ui/lib/utils";
import { ArrowLeft, ArrowRight, Lock, RotateCw } from "lucide-react";
import * as React from "react";

interface WebPreviewContextValue {
  canGoBack?: boolean;
  canGoForward?: boolean;
  onReload?: () => void;
  setUrl: (url: string) => void;
  url: string;
}

const WebPreviewContext = React.createContext<WebPreviewContextValue | null>(
  null
);

function useWebPreview() {
  const context = React.useContext(WebPreviewContext);

  if (!context) {
    throw new Error(
      "WebPreview subcomponents must be used within a WebPreview."
    );
  }

  return context;
}

function WebPreview({
  children,
  className,
  defaultUrl = "",
  onUrlChange,
  url: controlledUrl,
  ...props
}: React.ComponentProps<"div"> & {
  defaultUrl?: string;
  onUrlChange?: (url: string) => void;
  url?: string;
}) {
  const [internalUrl, setInternalUrl] = React.useState(defaultUrl);
  const currentUrl = controlledUrl ?? internalUrl;

  const setUrl = React.useCallback(
    (newUrl: string) => {
      setInternalUrl(newUrl);
      onUrlChange?.(newUrl);
    },
    [onUrlChange]
  );

  const contextValue = React.useMemo(
    () => ({
      setUrl,
      url: currentUrl,
    }),
    [currentUrl, setUrl]
  );

  return (
    <WebPreviewContext.Provider value={contextValue}>
      <div
        className={cn(
          "border-border bg-card text-card-foreground flex flex-col overflow-hidden rounded-xl border shadow-xs",
          className
        )}
        data-slot="web-preview"
        {...props}
      >
        {children}
      </div>
    </WebPreviewContext.Provider>
  );
}

function WebPreviewNavigation({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "border-border bg-muted/40 flex items-center gap-2 border-b px-3.5 py-2",
        className
      )}
      data-slot="web-preview-navigation"
      {...props}
    >
      {/* Window Controls (Traffic Lights) */}
      <div className="flex items-center gap-1.5 pr-1">
        <span className="bg-border size-2 rounded-full" />
        <span className="bg-border size-2 rounded-full" />
        <span className="bg-border size-2 rounded-full" />
      </div>
      {children}
    </div>
  );
}

function WebPreviewNavigationButton({
  action,
  children,
  className,
  disabled,
  onClick,
  ...props
}: React.ComponentProps<"button"> & {
  action?: "back" | "forward" | "reload";
}) {
  return (
    <button
      className={cn(
        "text-muted-foreground hover:text-foreground hover:bg-muted inline-flex size-6 items-center justify-center rounded-md text-xs transition-colors disabled:pointer-events-none disabled:opacity-40",
        className
      )}
      disabled={disabled}
      onClick={onClick}
      type="button"
      {...props}
    >
      {children ?? (
        <>
          {action === "back" && <ArrowLeft className="size-3.5" />}
          {action === "forward" && <ArrowRight className="size-3.5" />}
          {action === "reload" && <RotateCw className="size-3.5" />}
        </>
      )}
    </button>
  );
}

function WebPreviewUrl({
  className,
  value: controlledValue,
  ...props
}: React.ComponentProps<"div"> & {
  value?: string;
}) {
  const { url } = useWebPreview();
  const displayUrl = controlledValue ?? url;

  return (
    <div
      className={cn(
        "border-border bg-background text-muted-foreground flex flex-1 items-center gap-1.5 truncate rounded-md border px-2.5 py-1 text-xs select-none",
        className
      )}
      data-slot="web-preview-url"
      {...props}
    >
      <Lock className="text-muted-foreground/60 size-3 shrink-0" />
      <span className="truncate">{displayUrl}</span>
    </div>
  );
}

function WebPreviewBody({
  children,
  className,
  src,
  ...props
}: React.ComponentProps<"div"> & {
  src?: string;
}) {
  return (
    <div
      className={cn("flex-1 overflow-auto", className)}
      data-slot="web-preview-body"
      {...props}
    >
      {src ? (
        <iframe
          className="size-full border-0"
          sandbox="allow-scripts allow-same-origin"
          src={src}
          title="Web Preview"
        />
      ) : (
        children
      )}
    </div>
  );
}

export {
  WebPreview,
  WebPreviewBody,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
  useWebPreview,
};
