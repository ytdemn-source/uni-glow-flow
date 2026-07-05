import { ChevronDown, ChevronUp, GraduationCap, ArrowRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Link } from 'react-router-dom';

interface DepartmentData {
  name: string;
  href: string;
  color: string;
  about: string;
}

interface DepartmentCardProps {
  department: DepartmentData;
  isOpen: boolean;
  onToggle: () => void;
}

export function DepartmentCard({ department, isOpen, onToggle }: DepartmentCardProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle} className="w-full">
      <div className="glass-card-elevated overflow-hidden">
        <CollapsibleTrigger asChild>
          <button className="w-full p-5 md:p-6 text-left group relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${department.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                    {department.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Study material & notes
                  </p>
                </div>
              </div>
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-5 pb-5 md:px-6 md:pb-6 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {department.about}
            </p>
            <Link
              to="/notes"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
            >
              Browse {department.name} notes <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
