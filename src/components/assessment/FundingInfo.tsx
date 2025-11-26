import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2 } from "lucide-react";

type PrimarySponsor = {
  category: 'first-blood' | 'second-blood' | 'third-blood' | 'in-laws' | 'self' | null;
  relation?: string;
  name?: string;
  profession?: string;
  amount?: string;
  address?: string;
  moneyLocation?: string;
};

type OtherSponsor = {
  name: string;
  relation: string;
  amountRange: string;
  specificAmount?: string;
  bankStatementType: string;
  address: string;
};

type FundingInfoProps = {
  onContinue: (fundingInfo: {
    primarySponsor: PrimarySponsor;
    otherSponsors?: OtherSponsor[];
  }) => void;
};

export function FundingInfo({ onContinue }: FundingInfoProps) {
  const [primarySponsor, setPrimarySponsor] = useState<PrimarySponsor>({
    category: null,
  });

  const [otherSponsors, setOtherSponsors] = useState<OtherSponsor[]>([]);
  const [showOtherSponsors, setShowOtherSponsors] = useState(false);

  const firstBloodRelations = ['Father', 'Mother', 'Brother', 'Sister'];
  const secondBloodRelations = [
    'Paternal Grandfather',
    'Paternal Grandmother',
    'Maternal Grandfather',
    'Maternal Grandmother',
    'Aunts/Uncle from Father\'s Side',
    'Aunts/Uncles from Mother\'s Side',
  ];
  const thirdBloodRelations = ['Paternal Cousin', 'Maternal Cousin'];
  const inLawsRelations = ['Father-in-law', 'Mother-in-Law'];
  const moneyLocations = ['Bank-FDR', 'Bank-Savings', 'Cash', 'Property', 'Not Preferring to Say Now'];

  const otherSponsorRelations = ['Father', 'Mother', 'Sister', 'Brother', 'Grandparents', 'Aunts/Uncles', 'Cousins', 'Others'];
  const amountRanges = ['5 Lac - 10 Lac', '11 Lac-20 Lac', '21 Lac-35 Lac', '36 Lac-50 Lac', '51 Lac or More'];
  const bankStatementTypes = ['FDR', 'Savings', 'Sanchyapatra', 'Others'];

  const handleCategorySelect = (category: PrimarySponsor['category']) => {
    setPrimarySponsor({
      category,
      relation: undefined,
      name: undefined,
      profession: undefined,
      amount: undefined,
      address: undefined,
      moneyLocation: undefined,
    });
  };

  const addOtherSponsor = () => {
    setOtherSponsors([
      ...otherSponsors,
      {
        name: '',
        relation: '',
        amountRange: '',
        bankStatementType: '',
        address: '',
      },
    ]);
  };

  const removeOtherSponsor = (index: number) => {
    setOtherSponsors(otherSponsors.filter((_, i) => i !== index));
  };

  const updateOtherSponsor = (index: number, field: keyof OtherSponsor, value: string) => {
    const updated = [...otherSponsors];
    updated[index] = { ...updated[index], [field]: value };
    setOtherSponsors(updated);
  };

  const isValid = () => {
    if (!primarySponsor.category) return false;
    
    if (primarySponsor.category === 'self') {
      return primarySponsor.profession && primarySponsor.amount && primarySponsor.address && primarySponsor.moneyLocation;
    } else {
      return primarySponsor.relation && primarySponsor.name && primarySponsor.profession && 
             primarySponsor.amount && primarySponsor.address && primarySponsor.moneyLocation;
    }
  };

  const handleSubmit = () => {
    if (!isValid()) return;

    const validOtherSponsors = otherSponsors.filter(
      sponsor => sponsor.name && sponsor.relation && sponsor.amountRange && 
                 sponsor.bankStatementType && sponsor.address
    );

    onContinue({
      primarySponsor,
      otherSponsors: validOtherSponsors.length > 0 ? validOtherSponsors : undefined,
    });
  };

  const renderPrimarySponsorFields = () => {
    if (!primarySponsor.category) return null;

    if (primarySponsor.category === 'self') {
      return (
        <div className="space-y-4 mt-6">
          <div>
            <Label htmlFor="selfProfession">Your Profession</Label>
            <Input
              id="selfProfession"
              value={primarySponsor.profession || ''}
              onChange={(e) => setPrimarySponsor({ ...primarySponsor, profession: e.target.value })}
              placeholder="Enter your profession"
            />
          </div>
          <div>
            <Label htmlFor="selfAmount">Amount in BDT</Label>
            <Input
              id="selfAmount"
              type="number"
              value={primarySponsor.amount || ''}
              onChange={(e) => setPrimarySponsor({ ...primarySponsor, amount: e.target.value })}
              placeholder="Enter amount"
            />
          </div>
          <div>
            <Label htmlFor="selfAddress">Your Full Address</Label>
            <Input
              id="selfAddress"
              value={primarySponsor.address || ''}
              onChange={(e) => setPrimarySponsor({ ...primarySponsor, address: e.target.value })}
              placeholder="Enter your full address"
            />
          </div>
          <div>
            <Label htmlFor="selfMoneyLocation">Where's the Money Now</Label>
            <Select
              value={primarySponsor.moneyLocation || ''}
              onValueChange={(value) => setPrimarySponsor({ ...primarySponsor, moneyLocation: value })}
            >
              <SelectTrigger id="selfMoneyLocation">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {moneyLocations.map((location) => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }

    let relations: string[] = [];
    if (primarySponsor.category === 'first-blood') relations = firstBloodRelations;
    else if (primarySponsor.category === 'second-blood') relations = secondBloodRelations;
    else if (primarySponsor.category === 'third-blood') relations = thirdBloodRelations;
    else if (primarySponsor.category === 'in-laws') relations = inLawsRelations;

    return (
      <div className="space-y-4 mt-6">
        <div>
          <Label htmlFor="relation">Select Relation</Label>
          <Select
            value={primarySponsor.relation || ''}
            onValueChange={(value) => setPrimarySponsor({ ...primarySponsor, relation: value })}
          >
            <SelectTrigger id="relation">
              <SelectValue placeholder="Select relation" />
            </SelectTrigger>
            <SelectContent>
              {relations.map((rel) => (
                <SelectItem key={rel} value={rel}>{rel}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="sponsorName">Name of the Person</Label>
          <Input
            id="sponsorName"
            value={primarySponsor.name || ''}
            onChange={(e) => setPrimarySponsor({ ...primarySponsor, name: e.target.value })}
            placeholder="Enter name"
          />
        </div>
        <div>
          <Label htmlFor="sponsorProfession">Profession of the Person</Label>
          <Input
            id="sponsorProfession"
            value={primarySponsor.profession || ''}
            onChange={(e) => setPrimarySponsor({ ...primarySponsor, profession: e.target.value })}
            placeholder="Enter profession"
          />
        </div>
        <div>
          <Label htmlFor="sponsorAmount">Amount in BDT that will be Sponsored</Label>
          <Input
            id="sponsorAmount"
            type="number"
            value={primarySponsor.amount || ''}
            onChange={(e) => setPrimarySponsor({ ...primarySponsor, amount: e.target.value })}
            placeholder="Enter amount"
          />
        </div>
        <div>
          <Label htmlFor="sponsorAddress">Full Address of the Person</Label>
          <Input
            id="sponsorAddress"
            value={primarySponsor.address || ''}
            onChange={(e) => setPrimarySponsor({ ...primarySponsor, address: e.target.value })}
            placeholder="Enter full address"
          />
        </div>
        <div>
          <Label htmlFor="moneyLocation">Where's the Money Now</Label>
          <Select
            value={primarySponsor.moneyLocation || ''}
            onValueChange={(value) => setPrimarySponsor({ ...primarySponsor, moneyLocation: value })}
          >
            <SelectTrigger id="moneyLocation">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {moneyLocations.map((location) => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Primary Sponsor */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <button
            onClick={() => handleCategorySelect('first-blood')}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              primarySponsor.category === 'first-blood'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="font-semibold">First Blood Relatives</div>
            <div className="text-sm text-muted-foreground mt-1">Father, Mother, Siblings</div>
          </button>

          <button
            onClick={() => handleCategorySelect('second-blood')}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              primarySponsor.category === 'second-blood'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="font-semibold">Second Blood Relatives</div>
            <div className="text-sm text-muted-foreground mt-1">Grandparents, Aunts, Uncles</div>
          </button>

          <button
            onClick={() => handleCategorySelect('third-blood')}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              primarySponsor.category === 'third-blood'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="font-semibold">Third Blood Relatives</div>
            <div className="text-sm text-muted-foreground mt-1">Cousins</div>
          </button>

          <button
            onClick={() => handleCategorySelect('in-laws')}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              primarySponsor.category === 'in-laws'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="font-semibold">In-Laws</div>
            <div className="text-sm text-muted-foreground mt-1">Father/Mother-in-law</div>
          </button>

          <button
            onClick={() => handleCategorySelect('self')}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              primarySponsor.category === 'self'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="font-semibold">Self</div>
            <div className="text-sm text-muted-foreground mt-1">Self-sponsored</div>
          </button>
        </div>

        {renderPrimarySponsorFields()}
      </div>

      <Separator />

      {/* Section 2: Other Sponsors (Optional) */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Other Sponsors (Optional)</h3>
          <p className="text-sm text-muted-foreground mt-1">
            If you have other sponsors besides the one mentioned above, you can add them here.
          </p>
        </div>

        {!showOtherSponsors && otherSponsors.length === 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setShowOtherSponsors(true);
              addOtherSponsor();
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Other Sponsor
          </Button>
        )}

        {(showOtherSponsors || otherSponsors.length > 0) && (
          <div className="space-y-6">
            {otherSponsors.map((sponsor, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Sponsor {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOtherSponsor(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div>
                  <Label htmlFor={`otherName-${index}`}>Name of the Sponsor</Label>
                  <Input
                    id={`otherName-${index}`}
                    value={sponsor.name}
                    onChange={(e) => updateOtherSponsor(index, 'name', e.target.value)}
                    placeholder="Enter sponsor name"
                  />
                </div>

                <div>
                  <Label htmlFor={`otherRelation-${index}`}>Relation with You</Label>
                  <Select
                    value={sponsor.relation}
                    onValueChange={(value) => updateOtherSponsor(index, 'relation', value)}
                  >
                    <SelectTrigger id={`otherRelation-${index}`}>
                      <SelectValue placeholder="Select relation" />
                    </SelectTrigger>
                    <SelectContent>
                      {otherSponsorRelations.map((rel) => (
                        <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`otherAmount-${index}`}>Amount to Sponsor</Label>
                  <Select
                    value={sponsor.amountRange}
                    onValueChange={(value) => updateOtherSponsor(index, 'amountRange', value)}
                  >
                    <SelectTrigger id={`otherAmount-${index}`}>
                      <SelectValue placeholder="Select amount range" />
                    </SelectTrigger>
                    <SelectContent>
                      {amountRanges.map((range) => (
                        <SelectItem key={range} value={range}>{range}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {sponsor.amountRange === '51 Lac or More' && (
                  <div>
                    <Label htmlFor={`specificAmount-${index}`}>Specific Amount in BDT</Label>
                    <Input
                      id={`specificAmount-${index}`}
                      type="number"
                      value={sponsor.specificAmount || ''}
                      onChange={(e) => updateOtherSponsor(index, 'specificAmount', e.target.value)}
                      placeholder="Enter specific amount"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor={`bankStatement-${index}`}>Type of Bank Statement</Label>
                  <Select
                    value={sponsor.bankStatementType}
                    onValueChange={(value) => updateOtherSponsor(index, 'bankStatementType', value)}
                  >
                    <SelectTrigger id={`bankStatement-${index}`}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {bankStatementTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`otherAddress-${index}`}>Full Address of the Person</Label>
                  <Input
                    id={`otherAddress-${index}`}
                    value={sponsor.address}
                    onChange={(e) => updateOtherSponsor(index, 'address', e.target.value)}
                    placeholder="Enter full address"
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addOtherSponsor}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Sponsor
            </Button>
          </div>
        )}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!isValid()}
        className="w-full"
      >
        Continue
      </Button>
    </div>
  );
}
