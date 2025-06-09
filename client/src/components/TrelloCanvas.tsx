import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreHorizontal, User } from 'lucide-react';

interface TrelloCard {
  id: string;
  title: string;
  description?: string;
  labels: string[];
  assignee?: string;
  dueDate?: string;
}

interface TrelloList {
  id: string;
  title: string;
  cards: TrelloCard[];
}

export function TrelloCanvas() {
  const [boards] = useState<TrelloList[]>([
    {
      id: 'todo',
      title: 'To Do',
      cards: [
        {
          id: '1',
          title: 'GameXchange Demo Prep',
          description: 'Prepare PTNI-AI scanner demonstration for Fort Worth meeting',
          labels: ['high-priority', 'sales'],
          assignee: 'DW',
          dueDate: '2025-06-10'
        },
        {
          id: '2',
          title: 'Blissful Memories Website',
          description: 'Complete Kate\'s photography booking system automation',
          labels: ['in-progress', 'pro-bono'],
          assignee: 'Dev Team'
        }
      ]
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      cards: [
        {
          id: '3',
          title: 'Pipeline Analytics Dashboard',
          description: 'Real-time Fort Worth lead tracking system',
          labels: ['development', 'analytics'],
          assignee: 'DW'
        },
        {
          id: '4',
          title: 'Grandfather Platform Migration',
          description: 'Legacy system modernization project',
          labels: ['migration', 'backend'],
          assignee: 'Tech Lead'
        }
      ]
    },
    {
      id: 'review',
      title: 'Review',
      cards: [
        {
          id: '5',
          title: 'JDD Project Requirements',
          description: 'Finalize scope and technical specifications',
          labels: ['planning', 'documentation'],
          assignee: 'JDD'
        }
      ]
    },
    {
      id: 'done',
      title: 'Completed',
      cards: [
        {
          id: '6',
          title: 'QNIS Intelligence Platform',
          description: 'Core AI intelligence system deployment',
          labels: ['completed', 'production'],
          assignee: 'DW'
        },
        {
          id: '7',
          title: 'Lead Generation Microsite',
          description: 'GameXchange targeting system deployed',
          labels: ['completed', 'marketing'],
          assignee: 'Marketing'
        }
      ]
    }
  ]);

  const getLabelColor = (label: string) => {
    const colors: Record<string, string> = {
      'high-priority': 'bg-red-100 text-red-800',
      'sales': 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'pro-bono': 'bg-purple-100 text-purple-800',
      'development': 'bg-indigo-100 text-indigo-800',
      'analytics': 'bg-cyan-100 text-cyan-800',
      'migration': 'bg-orange-100 text-orange-800',
      'backend': 'bg-gray-100 text-gray-800',
      'planning': 'bg-yellow-100 text-yellow-800',
      'documentation': 'bg-pink-100 text-pink-800',
      'completed': 'bg-emerald-100 text-emerald-800',
      'production': 'bg-teal-100 text-teal-800',
      'marketing': 'bg-violet-100 text-violet-800'
    };
    return colors[label] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">DWC Systems Project Board</h1>
          <p className="text-gray-600">Active projects and task management for Fort Worth operations</p>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-6">
          {boards.map((list) => (
            <div key={list.id} className="flex-shrink-0 w-80">
              <Card className="bg-white shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-700">
                      {list.title}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {list.cards.length}
                      </span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {list.cards.map((card) => (
                    <Card key={card.id} className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-3">
                        <h3 className="font-medium text-gray-900 mb-2 text-sm">
                          {card.title}
                        </h3>
                        {card.description && (
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                            {card.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {card.labels.map((label) => (
                            <Badge 
                              key={label} 
                              variant="secondary" 
                              className={`text-xs px-2 py-0 ${getLabelColor(label)}`}
                            >
                              {label}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          {card.assignee && (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-600">{card.assignee}</span>
                            </div>
                          )}
                          {card.dueDate && (
                            <span className="text-xs text-gray-500">
                              Due {new Date(card.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add a card
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
          
          <div className="flex-shrink-0 w-80">
            <Button 
              variant="ghost" 
              className="w-full h-12 border-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add another list
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}