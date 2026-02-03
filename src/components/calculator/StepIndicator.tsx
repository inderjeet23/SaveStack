'use client';

interface Step {
  id: number;
  name: string;
}

const steps: Step[] = [
  { id: 1, name: 'Location' },
  { id: 2, name: 'Household' },
  { id: 3, name: 'Upgrades' },
  { id: 4, name: 'Results' },
];

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-center space-x-2 md:space-x-4">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="flex items-center">
            {step.id < currentStep ? (
              // Completed step
              <div className="flex items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                  <svg
                    className="h-5 w-5 text-primary-foreground"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="ml-2 hidden text-sm font-medium md:block">{step.name}</span>
              </div>
            ) : step.id === currentStep ? (
              // Current step
              <div className="flex items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-primary/10">
                  <span className="text-sm font-semibold text-primary">{step.id}</span>
                </span>
                <span className="ml-2 hidden text-sm font-medium text-primary md:block">
                  {step.name}
                </span>
              </div>
            ) : (
              // Upcoming step
              <div className="flex items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-muted-foreground/30">
                  <span className="text-sm font-medium text-muted-foreground">{step.id}</span>
                </span>
                <span className="ml-2 hidden text-sm font-medium text-muted-foreground md:block">
                  {step.name}
                </span>
              </div>
            )}

            {/* Connector line */}
            {stepIdx !== steps.length - 1 && (
              <div
                className={`ml-2 h-0.5 w-8 md:w-12 ${
                  step.id < currentStep ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
