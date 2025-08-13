
import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../hooks/useAuth';
import { useTools } from '../hooks/useTools';
import { useIsMobile } from '../hooks/use-mobile';
import { useIsTablet } from '../hooks/use-tablet';
import AddToolForm from './AddToolForm';
import ToolIcon from './ToolIcon';

const Tools = () => {
  const { user } = useAuth();
  const { data: tools = [], isLoading } = useTools();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  // Function to get Manage Tools button content based on viewport
  const getManageButtonContent = () => {
    if (isMobile) {
      return <Settings className="w-5 h-5" />;
    } else if (isTablet) {
      return (
        <>
          <Settings className="w-5 h-5 mr-2" />
          Manage
        </>
      );
    } else {
      return (
        <>
          <Settings className="w-5 h-5 mr-2" />
          Manage Tools
        </>
      );
    }
  };

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
                <Button 
                  onClick={() => setIsFormOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {getManageButtonContent()}
                </Button>
              )}
            </div>
          </div>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            A comprehensive toolkit of professional applications and platforms that power 
            my workflow and enable exceptional results for every project.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-blue-200">Loading tools...</div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className={`group p-3 rounded-xl ${tool.color} shadow-lg transform transition-all duration-300 cursor-pointer backdrop-blur-sm bg-white/90 dark:bg-white/95 relative`}
                title={`${tool.name} - ${tool.category}`}
              >
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 mb-2 rounded-lg bg-white/80 flex items-center justify-center shadow-sm transition-transform duration-1000 ease-in-out relative">
                    <ToolIcon 
                      tool={tool}
                      className="w-6 h-6"
                      showUpload={user && user.id === tool.user_id}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-800 text-center leading-tight">
                    {tool.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <p className="text-blue-200 max-w-2xl mx-auto">
            This toolkit is continuously evolving with the latest technologies and platforms 
            to ensure cutting-edge solutions for your business needs.
          </p>
        </div>

        {/* Add Tool Form */}
        <AddToolForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      </div>
    </section>
  );
};

export default Tools;
