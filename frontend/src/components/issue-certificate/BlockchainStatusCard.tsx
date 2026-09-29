import { CircleDot } from 'lucide-react';

export const BlockchainStatusCard = () => {
  return (
    <section className="rounded-2xl border border-primary-light/80 bg-primary-lighter/70 p-4 shadow-sm">
      <div className="flex items-center gap-2 text-primary">
        <CircleDot size={14} fill="currentColor" />
        <h3 className="text-sm font-semibold">Blockchain Ready</h3>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-y-3 text-sm">
        <dt className="text-slate-500">Network</dt>
        <dd className="text-right font-semibold text-slate-700">Polygon Network</dd>

        <dt className="text-slate-500">Status</dt>
        <dd className="text-right font-semibold text-slate-700">Active · Block #18,421,039</dd>

        <dt className="text-slate-500">Est. time</dt>
        <dd className="text-right font-semibold text-slate-700">~12 seconds</dd>
      </dl>
    </section>
  );
};

export default BlockchainStatusCard;
