import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error('UI error', error, info); }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" className="grid min-h-[60vh] place-items-center p-8 text-center">
        <div>
          <h1 className="text-3xl font-semibold">Something went wrong</h1>
          <p className="mt-3 text-mist-600">Reload the page. If it keeps happening, contact our team.</p>
          <button className="mt-6 rounded-full bg-electric px-6 py-3 text-white" onClick={() => window.location.reload()}>Reload page</button>
        </div>
      </div>
    );
  }
}
