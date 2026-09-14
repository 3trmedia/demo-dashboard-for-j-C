import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#faf9f7] px-6 text-center">
          <p className="text-lg font-semibold text-neutral-900">Something went wrong.</p>
          <p className="max-w-sm text-sm text-neutral-500">
            Try reloading the page. If it keeps happening, resetting saved layout may help.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="rounded-full px-4 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: "#cd553f" }}
            >
              Reload
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600"
            >
              Reset layout &amp; reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
