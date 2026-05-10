import React from 'react';
import { MessageSquare, Check, Clock, AlertTriangle } from 'lucide-react';
import { SupportTicket } from '../../types';

export default function SupportTickets() {
  const tickets: SupportTicket[] = [
    { id: 'tk_1', tenantId: '1', tenantName: 'Joe Pizza', subject: 'Domain SSL issue', message: 'My custom domain is showing not secure.', status: 'open', priority: 'high', createdAt: Date.now() - 3600000 },
    { id: 'tk_2', tenantId: '3', tenantName: 'Sushi Lounge', subject: 'Menu not updating', message: 'I changed prices but they still show old ones on the app.', status: 'open', priority: 'medium', createdAt: Date.now() - 86400000 },
    { id: 'tk_3', tenantId: '2', tenantName: 'Burger Hub', subject: 'Stripe payout question', message: 'When do I receive my funds?', status: 'resolved', priority: 'low', createdAt: Date.now() - 259200000 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Support Tickets</h2>
        <p className="text-zinc-400 text-sm mt-1">Manage inquiries from restaurant owners.</p>
      </div>

      <div className="grid gap-4">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${
                  ticket.priority === 'high' ? 'bg-red-500' : ticket.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <h3 className="font-semibold text-white">{ticket.subject}</h3>
                <span className="text-xs text-zinc-500">#{ticket.id}</span>
              </div>
              {ticket.status === 'resolved' ? (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                  <Check size={12} /> Resolved
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded">
                  <Clock size={12} /> Open
                </span>
              )}
            </div>
            
            <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{ticket.message}</p>
            
            <div className="flex justify-between items-center text-xs text-zinc-500">
              <div className="flex items-center gap-2">
                <span className="text-zinc-300 font-medium">{ticket.tenantName}</span>
                <span>•</span>
                <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>
              {ticket.status === 'open' && (
                <button className="text-indigo-400 hover:text-indigo-300 font-medium">Reply</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
