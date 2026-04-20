"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TerminalPanelProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  badge?: string | React.ReactNode;
  status?: "live" | "demo" | "error" | "loading";
  actions?: React.ReactNode;
  noPadding?: boolean;
  glow?: boolean;
  animate?: boolean;
}

export function TerminalPanel({
  children,
  className,
  title,
  subtitle,
  badge,
  status,
  actions,
  noPadding,
  glow,
  animate = true,
}: TerminalPanelProps) {
  const Wrapper = animate ? motion.div : "div";
  const wrapperProps = animate
    ? {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3, ease: "easeOut" },
      }
    : {};

  return (
    <Wrapper
      {...(wrapperProps as object)}
      className={cn(
        "panel panel-hover relative",
        glow && "panel-glow",
        className
      )}
    >
      {(title || badge || actions) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            {title && (
              <div className="flex items-center gap-2">
                <span className="terminal-text text-xs font-semibold tracking-widest uppercase text-green-primary/80">
                  {title}
                </span>
                {subtitle && (
                  <span className="text-xs text-[#444] terminal-text">
                    / {subtitle}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {status && <StatusBadge status={status} />}
            {badge && (
              <span className="terminal-text text-[10px] text-[#444] tracking-widest">
                {badge}
              </span>
            )}
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        </div>
      )}
      <div className={cn(!noPadding && "p-4")}>{children}</div>
    </Wrapper>
  );
}

function StatusBadge({ status }: { status: "live" | "demo" | "error" | "loading" }) {
  if (status === "live") {
    return (
      <div className="flex items-center gap-1.5">
        <span className="status-dot" />
        <span className="terminal-text text-[10px] text-green-muted tracking-wider">
          LIVE
        </span>
      </div>
    );
  }
  if (status === "demo") {
    return (
      <div className="flex items-center gap-1.5">
        <span
          className="w-1.5 h-1.5 rounded-full bg-yellow-400"
          style={{ boxShadow: "0 0 4px #ffaa00" }}
        />
        <span className="terminal-text text-[10px] text-yellow-400/70 tracking-wider">
          DEMO
        </span>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex items-center gap-1.5">
        <span className="status-dot danger" />
        <span className="terminal-text text-[10px] text-danger/70 tracking-wider">
          ERROR
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-[#444] animate-pulse" />
      <span className="terminal-text text-[10px] text-[#444] tracking-wider">
        LOADING
      </span>
    </div>
  );
}
