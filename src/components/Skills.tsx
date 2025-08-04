
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../hooks/useAuth';
import { useSkillsWithExpertise } from '../hooks/useSkills';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import AddSkillForm from './AddSkillForm';
import SkillActions from './SkillActions';
import DynamicIcon from './DynamicIcon';

const Skills = () => {
  const { user } = useAuth();
  const [showAddSkillForm, setShowAddSkillForm] = useState(false);
  // Show hidden skills only when user is logged in
  const { data: skillsWithExpertise = [] } = useSkillsWithExpertise(!!user);
  
  // Intersection observer for scroll animation
  const { ref: skillsRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  // Sort skills alphabetically by skill name
  const sortedSkills = [...skillsWithExpertise].sort((a, b) => 
    a.skill_name.localeCompare(b.skill_name)
  );

  const handleSkillAdded = () => {
    console.log('Skill added - skills list will update automatically');
  };

  return (
    <>
      <section id="skills" className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1"></div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white">
                Skills & Expertise
              </h2>
              <div className="flex-1 flex justify-end">
                {user && (
                  <Button 
                    onClick={() => setShowAddSkillForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Skills
                  </Button>
                )}
              </div>
            </div>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Comprehensive solutions tailored to elevate your business operations, 
              enhance productivity, and drive measurable growth across all digital touchpoints.
            </p>
          </div>

          <div ref={skillsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Database Skills */}
            {sortedSkills.map((skill, index) => {
              const expertise = skill.skills_expertise?.[0];
              const skillDetails = expertise?.details || [`Professional ${skill.skill_name} services`];
              
              return (
                <div
                  key={skill.id}
                  className={`relative group bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-lg transition-all duration-700 dark:shadow-slate-900/50 transform ${
                    hasIntersected 
                      ? 'scale-100 opacity-100' 
                      : 'scale-75 opacity-0'
                  } ${skill.hidden ? 'opacity-60 border-2 border-dashed border-yellow-400' : ''}`}
                  style={{ 
                    transitionDelay: hasIntersected ? `${index * 100}ms` : '0ms'
                  }}
                >
                  {user && (
                    <SkillActions
                      skillId={skill.id}
                      skillName={skill.skill_name}
                      isHidden={skill.hidden}
                    />
                  )}

                  {skill.hidden && user && (
                    <div className="absolute top-4 left-4 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Hidden
                    </div>
                  )}

                  {skill.badge && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {skill.badge}
                    </div>
                  )}
                  
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${skill.color || 'from-slate-500 to-slate-600'} flex items-center justify-center text-white mb-6 shadow-lg transition-transform duration-300`}>
                    <DynamicIcon iconName={skill.icon || "Star"} className="w-8 h-8" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 transition-all duration-300">
                    {skill.skill_name}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                    {skill.description || `Professional ${skill.skill_name} services`}
                  </p>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Key Services:
                    </h4>
                    <ul className="space-y-2">
                      {skillDetails.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start space-x-2 text-sm">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mt-2 flex-shrink-0"></div>
                          <span className="text-slate-600 dark:text-slate-300">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}

            {/* Add Skill Button - Circular button */}
            {user && (
              <div className="flex justify-center items-center">
                <Button
                  onClick={() => setShowAddSkillForm(true)}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-110"
                  title="Add New Skill"
                >
                  <Plus className="w-8 h-8" />
                </Button>
              </div>
            )}

            {/* Show message when no skills are available */}
            {sortedSkills.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-600 dark:text-slate-300 text-lg mb-4">
                  No skills available at the moment.
                </p>
                {user && (
                  <Button 
                    onClick={() => setShowAddSkillForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Your First Skill
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Add Skill Form Dialog */}
      <AddSkillForm
        isOpen={showAddSkillForm}
        onClose={() => setShowAddSkillForm(false)}
        onSkillAdded={handleSkillAdded}
      />
    </>
  );
};

export default Skills;
