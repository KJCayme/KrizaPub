
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../hooks/useAuth';

const Tools = () => {
  const { user } = useAuth();

  const tools = [
    {
      name: "Notion",
      category: "Productivity",
      icon: "https://www.notion.so/images/favicon.ico",
      color: "bg-white"
    },
    {
      name: "Canva",
      category: "Design",
      icon: "https://static.canva.com/web/images/favicon.ico",
      color: "bg-purple-100"
    },
    {
      name: "Figma",
      category: "Design",
      icon: "https://static.figma.com/app/icon/1/favicon.ico",
      color: "bg-orange-100"
    },
    {
      name: "Adobe Creative Suite",
      category: "Design",
      icon: "https://www.adobe.com/favicon.ico",
      color: "bg-red-100"
    },
    {
      name: "Slack",
      category: "Communication",
      icon: "https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png",
      color: "bg-purple-100"
    },
    {
      name: "Trello",
      category: "Project Management",
      icon: "https://trello.com/favicon.ico",
      color: "bg-blue-100"
    },
    {
      name: "Asana",
      category: "Project Management",
      icon: "https://asana.com/favicon.ico",
      color: "bg-orange-100"
    },
    {
      name: "Google Workspace",
      category: "Productivity",
      icon: "https://workspace.google.com/favicon.ico",
      color: "bg-blue-100"
    },
    {
      name: "Hootsuite",
      category: "Social Media",
      icon: "https://hootsuite.com/favicon.ico",
      color: "bg-yellow-100"
    },
    {
      name: "Buffer",
      category: "Social Media",
      icon: "https://buffer.com/favicon.ico",
      color: "bg-blue-100"
    },
    {
      name: "Later",
      category: "Social Media",
      icon: "https://later.com/favicon.ico",
      color: "bg-green-100"
    },
    {
      name: "Loom",
      category: "Video",
      icon: "https://www.loom.com/favicon.ico",
      color: "bg-purple-100"
    },
    {
      name: "Zoom",
      category: "Communication",
      icon: "https://zoom.us/favicon.ico",
      color: "bg-blue-100"
    },
    {
      name: "Microsoft Office",
      category: "Productivity",
      icon: "https://res.cdn.office.net/assets/mail/file-icon/png/generic_16x16.png",
      color: "bg-blue-100"
    },
    {
      name: "Grammarly",
      category: "Writing",
      icon: "https://static.grammarly.com/assets/files/efe57d016d9efff36da7884c193b646b/favicon-32x32.png",
      color: "bg-green-100"
    },
    {
      name: "Calendly",
      category: "Scheduling",
      icon: "https://calendly.com/favicon.ico",
      color: "bg-blue-100"
    }
  ];

  return (
    <section id="tools" className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 dark:from-slate-950 dark:via-purple-950 dark:to-indigo-950 relative overflow-hidden transition-colors duration-300">
      {/* Digital world background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="grid grid-cols-8 md:grid-cols-12 gap-8 p-8 transform rotate-12">
            {Array.from({ length: 96 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1"></div>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Tools & Applications
            </h2>
            <div className="flex-1 flex justify-end">
              {user && (
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <Plus className="w-5 h-5 mr-2" />
                  Add
                </Button>
              )}
            </div>
          </div>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            A comprehensive toolkit of professional applications and platforms that power 
            my workflow and enable exceptional results for every project.
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {tools.map((tool, index) => (
            <div
              key={index}
              className={`group p-3 rounded-xl ${tool.color} shadow-lg transform transition-all duration-300 cursor-pointer backdrop-blur-sm bg-white/90 dark:bg-white/95`}
              title={`${tool.name} - ${tool.category}`}
            >
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 mb-2 rounded-lg bg-white/80 flex items-center justify-center shadow-sm transition-transform duration-1000 ease-in-out">
                  <img
                    src={tool.icon}
                    alt={tool.name}
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>`;
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-800 text-center leading-tight">
                  {tool.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-blue-200 max-w-2xl mx-auto">
            This toolkit is continuously evolving with the latest technologies and platforms 
            to ensure cutting-edge solutions for your business needs.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Tools;
