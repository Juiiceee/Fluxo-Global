import { useState, useCallback } from "react";
import { executeAction, type Action, type EvmAgentKit } from "@/agent";
import { toast } from "sonner";
import { ToolConfirmation } from "@/components/ToolConfirmation";

interface GenericToolConfirmationProps {
  agent: EvmAgentKit;
  toolCallId: string;
  toolName: string;
  args: Record<string, any>;
  action: Action;
  addToolResult: (args: { toolCallId: string; output: string }) => void;
  className?: string;
}

type ConfirmationState = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export function GenericToolConfirmation({
  agent,
  toolCallId,
  toolName,
  args,
  action,
  addToolResult,
  className
}: GenericToolConfirmationProps) {
  const [state, setState] = useState<ConfirmationState>('pending');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleConfirm = useCallback(async () => {
    if (!agent || !addToolResult) return;

    setState('processing');
    setError(null);

    try {
      const actionResult = await executeAction(action, agent, args);
      
      setResult(actionResult);
      
      addToolResult({
        toolCallId,
        output: JSON.stringify(actionResult),
      });

      setState('completed');
      toast.success(`${action.name} completed successfully`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      
      addToolResult({
        toolCallId,
        output: JSON.stringify({
          success: false,
          error: errorMessage,
        }),
      });

      setState('failed');
      toast.error(`${action.name} failed: ${errorMessage}`);
    }
  }, [agent, addToolResult, action, args, toolCallId]);

  const handleCancel = useCallback(() => {
    if (!addToolResult) return;
    
    setState('cancelled');
    
    addToolResult({
      toolCallId,
      output: JSON.stringify({
        success: false,
        error: "User rejected the operation",
      }),
    });

    toast.info("Operation cancelled");
  }, [addToolResult, toolCallId]);

  return (
    <ToolConfirmation
      open={true}
      onOpenChange={() => {}}
      title={action.name}
      description={action.description}
      args={args}
      result={result}
      state={state}
      error={error}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      className={className}
    />
  );
}