import React from 'react';
import { AlertCircle, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { PipelineEvent } from '../types';

interface AgentPipelineFeedProps {
  events: PipelineEvent[];
}

export const AgentPipelineFeed: React.FC<AgentPipelineFeedProps> = ({ events }) => {
  return (
    <div className="border-t border-slate-200 pt-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="font-display text-xs font-semibold tracking-wide text-slate-700">
          Agent Execution Feed
        </h3>
        <span className="font-mono text-[11px] text-slate-500 tabular-nums">
          {events.filter((e) => e.status === 'completed').length}/{events.length} complete
        </span>
      </div>

      <div className="space-y-2.5" aria-live="polite">
        {events.map((event) => {
          const isRunning = event.status === 'running';
          const isCompleted = event.status === 'completed';
          const isError = event.status === 'error';

          return (
            <div
              key={event.id}
              className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-xs"
            >
              <div className="mt-0.5 shrink-0">
                {isRunning && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" aria-hidden="true" />
                )}
                {isCompleted && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                )}
                {isError && (
                  <AlertCircle className="h-3.5 w-3.5 text-red-600" aria-hidden="true" />
                )}
                {event.status === 'pending' && (
                  <Clock className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-800">{event.agent}</span>
                  <span className="font-mono text-[11px] text-slate-500 tabular-nums shrink-0">
                    {event.timestamp}
                  </span>
                </div>
                <p className="mt-0.5 leading-relaxed text-slate-600">{event.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
