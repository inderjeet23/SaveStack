'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { StepIndicator } from './StepIndicator';
import { ZipCodeInput } from './ZipCodeInput';
import { HouseholdSelector } from './HouseholdSelector';
import { UpgradeSelector } from './UpgradeSelector';
import type { HomeType, UpgradeCategory, CalculatorInput } from '@/types';

// Zip code to state mapping (simplified - first 3 digits)
const zipToState: Record<string, string> = {
  '900': 'California',
  '901': 'California',
  '902': 'California',
  '903': 'California',
  '904': 'California',
  '905': 'California',
  '906': 'California',
  '907': 'California',
  '908': 'California',
  '910': 'California',
  '911': 'California',
  '912': 'California',
  '913': 'California',
  '914': 'California',
  '915': 'California',
  '916': 'California',
  '917': 'California',
  '918': 'California',
  '919': 'California',
  '920': 'California',
  '921': 'California',
  '922': 'California',
  '923': 'California',
  '924': 'California',
  '925': 'California',
  '926': 'California',
  '927': 'California',
  '928': 'California',
  '930': 'California',
  '931': 'California',
  '932': 'California',
  '933': 'California',
  '934': 'California',
  '935': 'California',
  '936': 'California',
  '937': 'California',
  '938': 'California',
  '939': 'California',
  '940': 'California',
  '941': 'California',
  '942': 'California',
  '943': 'California',
  '944': 'California',
  '945': 'California',
  '946': 'California',
  '947': 'California',
  '948': 'California',
  '949': 'California',
  '950': 'California',
  '951': 'California',
  '952': 'California',
  '953': 'California',
  '954': 'California',
  '955': 'California',
  '956': 'California',
  '957': 'California',
  '958': 'California',
  '959': 'California',
  '960': 'California',
  '961': 'California',
  '100': 'New York',
  '101': 'New York',
  '102': 'New York',
  '103': 'New York',
  '104': 'New York',
  '105': 'New York',
  '106': 'New York',
  '107': 'New York',
  '108': 'New York',
  '109': 'New York',
  '110': 'New York',
  '111': 'New York',
  '112': 'New York',
  '113': 'New York',
  '114': 'New York',
  '115': 'New York',
  '116': 'New York',
  '117': 'New York',
  '118': 'New York',
  '119': 'New York',
  '120': 'New York',
  '121': 'New York',
  '122': 'New York',
  '123': 'New York',
  '124': 'New York',
  '125': 'New York',
  '126': 'New York',
  '127': 'New York',
  '128': 'New York',
  '129': 'New York',
  '130': 'New York',
  '131': 'New York',
  '132': 'New York',
  '133': 'New York',
  '134': 'New York',
  '135': 'New York',
  '136': 'New York',
  '137': 'New York',
  '138': 'New York',
  '139': 'New York',
  '140': 'New York',
  '141': 'New York',
  '142': 'New York',
  '143': 'New York',
  '144': 'New York',
  '145': 'New York',
  '146': 'New York',
  '147': 'New York',
  '148': 'New York',
  '149': 'New York',
  '800': 'Colorado',
  '801': 'Colorado',
  '802': 'Colorado',
  '803': 'Colorado',
  '804': 'Colorado',
  '805': 'Colorado',
  '806': 'Colorado',
  '807': 'Colorado',
  '808': 'Colorado',
  '809': 'Colorado',
  '810': 'Colorado',
  '811': 'Colorado',
  '812': 'Colorado',
  '813': 'Colorado',
  '814': 'Colorado',
  '815': 'Colorado',
  '816': 'Colorado',
  '480': 'Michigan',
  '481': 'Michigan',
  '482': 'Michigan',
  '483': 'Michigan',
  '484': 'Michigan',
  '485': 'Michigan',
  '486': 'Michigan',
  '487': 'Michigan',
  '488': 'Michigan',
  '489': 'Michigan',
  '490': 'Michigan',
  '491': 'Michigan',
  '492': 'Michigan',
  '493': 'Michigan',
  '494': 'Michigan',
  '495': 'Michigan',
  '496': 'Michigan',
  '497': 'Michigan',
  '498': 'Michigan',
  '499': 'Michigan',
  '270': 'North Carolina',
  '271': 'North Carolina',
  '272': 'North Carolina',
  '273': 'North Carolina',
  '274': 'North Carolina',
  '275': 'North Carolina',
  '276': 'North Carolina',
  '277': 'North Carolina',
  '278': 'North Carolina',
  '279': 'North Carolina',
  '280': 'North Carolina',
  '281': 'North Carolina',
  '282': 'North Carolina',
  '283': 'North Carolina',
  '284': 'North Carolina',
  '285': 'North Carolina',
  '286': 'North Carolina',
  '287': 'North Carolina',
  '288': 'North Carolina',
  '289': 'North Carolina',
  '300': 'Georgia',
  '301': 'Georgia',
  '302': 'Georgia',
  '303': 'Georgia',
  '304': 'Georgia',
  '305': 'Georgia',
  '306': 'Georgia',
  '307': 'Georgia',
  '308': 'Georgia',
  '309': 'Georgia',
  '310': 'Georgia',
  '311': 'Georgia',
  '312': 'Georgia',
  '313': 'Georgia',
  '314': 'Georgia',
  '315': 'Georgia',
  '316': 'Georgia',
  '317': 'Georgia',
  '318': 'Georgia',
  '319': 'Georgia',
  '398': 'Georgia',
  '399': 'Georgia',
  '850': 'Arizona',
  '851': 'Arizona',
  '852': 'Arizona',
  '853': 'Arizona',
  '855': 'Arizona',
  '856': 'Arizona',
  '857': 'Arizona',
  '859': 'Arizona',
  '860': 'Arizona',
  '863': 'Arizona',
  '864': 'Arizona',
  '865': 'Arizona',
  '980': 'Washington',
  '981': 'Washington',
  '982': 'Washington',
  '983': 'Washington',
  '984': 'Washington',
  '985': 'Washington',
  '986': 'Washington',
  '988': 'Washington',
  '989': 'Washington',
  '990': 'Washington',
  '991': 'Washington',
  '992': 'Washington',
  '993': 'Washington',
  '994': 'Washington',
  '039': 'Maine',
  '040': 'Maine',
  '041': 'Maine',
  '042': 'Maine',
  '043': 'Maine',
  '044': 'Maine',
  '045': 'Maine',
  '046': 'Maine',
  '047': 'Maine',
  '048': 'Maine',
  '049': 'Maine',
  '530': 'Wisconsin',
  '531': 'Wisconsin',
  '532': 'Wisconsin',
  '534': 'Wisconsin',
  '535': 'Wisconsin',
  '537': 'Wisconsin',
  '538': 'Wisconsin',
  '539': 'Wisconsin',
  '540': 'Wisconsin',
  '541': 'Wisconsin',
  '542': 'Wisconsin',
  '543': 'Wisconsin',
  '544': 'Wisconsin',
  '545': 'Wisconsin',
  '546': 'Wisconsin',
  '547': 'Wisconsin',
  '548': 'Wisconsin',
  '549': 'Wisconsin',
};

function getStateFromZip(zip: string): string | undefined {
  const prefix = zip.substring(0, 3);
  return zipToState[prefix];
}

interface CalculatorFormProps {
  initialData?: Partial<CalculatorInput>;
}

export function CalculatorForm({ initialData }: CalculatorFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form state
  const [zipCode, setZipCode] = useState(initialData?.zipCode || '');
  const [income, setIncome] = useState(initialData?.householdIncome || 0);
  const [householdSize, setHouseholdSize] = useState(initialData?.householdSize || 0);
  const [homeType, setHomeType] = useState<HomeType>(
    initialData?.homeType || 'single_family'
  );
  const [isOwner, setIsOwner] = useState(initialData?.isOwner ?? true);
  const [selectedUpgrades, setSelectedUpgrades] = useState<UpgradeCategory[]>(
    initialData?.selectedUpgrades || []
  );

  // Derived state
  const detectedState = zipCode.length >= 3 ? getStateFromZip(zipCode) : undefined;

  const goToResults = useCallback(() => {
    // Build URL params for shareable results
    const params = new URLSearchParams({
      zip: zipCode,
      income: income.toString(),
      size: householdSize.toString(),
      home: homeType,
      owner: isOwner ? '1' : '0',
      upgrades: selectedUpgrades.join(','),
    });

    router.push(`/results?${params.toString()}`);
  }, [zipCode, income, householdSize, homeType, isOwner, selectedUpgrades, router]);

  return (
    <div className="py-8">
      <StepIndicator currentStep={step} />

      <div className="mt-8">
        {step === 1 && (
          <ZipCodeInput
            value={zipCode}
            onChange={setZipCode}
            onNext={() => setStep(2)}
            detectedState={detectedState}
          />
        )}

        {step === 2 && (
          <HouseholdSelector
            income={income}
            householdSize={householdSize}
            homeType={homeType}
            isOwner={isOwner}
            onIncomeChange={setIncome}
            onHouseholdSizeChange={setHouseholdSize}
            onHomeTypeChange={setHomeType}
            onOwnershipChange={setIsOwner}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <UpgradeSelector
            selected={selectedUpgrades}
            onChange={setSelectedUpgrades}
            onNext={goToResults}
            onBack={() => setStep(2)}
          />
        )}
      </div>
    </div>
  );
}
