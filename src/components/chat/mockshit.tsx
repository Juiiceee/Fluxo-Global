import { useState, useCallback } from "react";
import { Check, X, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { executeAction, type Action, type EvmAgentKit } from "@/agent";
import { toast } from "sonner";

interface GenericToolConfirmationProps {
  agent: EvmAgentKit;
  toolCallId: string;
  toolName: string;
  args: Record<string, any>;
  action: Action;
  addToolResult: (args: { toolCallId: string; output: string }) => void;
  className?: string;
}

type ConfirmationState = 'pending' | 'confirmed' | 'rejected' | 'processing' | 'completed' | 'failed';

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

  const handleConfirm = useCallback(async () => {
    console.log("handleConfirm", agent, addToolResult, args, action, toolCallId);
    if (!agent || !addToolResult) return;

    setState('processing');
    setError(null);

    try {
      console.log("executeAction", action, agent, args);
      const result = await executeAction(action, agent, args);
      
      addToolResult({
        toolCallId,
        output: JSON.stringify(result),
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

  const handleReject = useCallback(() => {
    if (!addToolResult) return;
    
    setState('rejected');
    
    addToolResult({
      toolCallId,
      output: JSON.stringify({
        success: false,
        error: "User rejected the operation",
      }),
    });

    toast.info("Operation cancelled");
  }, [addToolResult, toolCallId]);

  const getStateConfig = () => {
    switch (state) {
      case 'pending':
        return {
          icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
          title: 'Confirm Action',
          description: action.description,
          bgColor: 'bg-amber-50 border-amber-200',
          textColor: 'text-amber-800',
          showButtons: true
        };
      case 'processing':
        return {
          icon: <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />,
          title: 'Processing...',
          description: `Executing ${action.name}`,
          bgColor: 'bg-blue-50 border-blue-200',
          textColor: 'text-blue-800',
          showButtons: false
        };
      case 'completed':
        return {
          icon: <Check className="h-5 w-5 text-green-500" />,
          title: 'Completed',
          description: `${action.name} executed successfully`,
          bgColor: 'bg-green-50 border-green-200',
          textColor: 'text-green-800',
          showButtons: false
        };
      case 'failed':
        return {
          icon: <X className="h-5 w-5 text-red-500" />,
          title: 'Failed',
          description: error || `${action.name} failed`,
          bgColor: 'bg-red-50 border-red-200',
          textColor: 'text-red-800',
          showButtons: false
        };
      case 'rejected':
        return {
          icon: <X className="h-5 w-5 text-gray-500" />,
          title: 'Cancelled',
          description: 'Operation was cancelled',
          bgColor: 'bg-gray-50 border-gray-200',
          textColor: 'text-gray-800',
          showButtons: false
        };
      default:
        return {
          icon: <AlertCircle className="h-5 w-5 text-gray-500" />,
          title: 'Unknown',
          description: 'Unknown state',
          bgColor: 'bg-gray-50 border-gray-200',
          textColor: 'text-gray-800',
          showButtons: false
        };
    }
  };

  const config = getStateConfig();

  const formatArgs = () => {
    const entries = Object.entries(args);
    if (entries.length === 0) return null;

    return (
      <div className="mt-3 space-y-2">
        <div className="text-sm font-medium text-gray-700">Arguments:</div>
        <div className="bg-gray-50 rounded-md p-2 text-sm">
          {entries.map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="font-medium">{key}:</span>
              <span className="text-gray-600 ml-2 break-all">
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "rounded-lg border-2 p-4 transition-all duration-200 max-w-md mx-auto",
        config.bgColor,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {config.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className={cn("font-semibold text-lg", config.textColor)}>
            {config.title}
          </div>
          
          <div className={cn("text-sm mt-1", config.textColor.replace('800', '700'))}>
            {config.description}
          </div>

          {formatArgs()}

          {config.showButtons && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleReject}
                className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
              >
                Confirm
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}