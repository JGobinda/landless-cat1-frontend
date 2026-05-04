import api from './api';

export interface DemographicResponse {
  success: boolean;
  message: string;
  data: {
    processId: string;
    [key: string]: any;
  };
}

export const demographicService = {

  createDemographic: async (formData: any): Promise<DemographicResponse> => {
    const payload = demographicService.mapFormDataToBackend(formData);
    const response = await api.post<DemographicResponse>('/demographics', payload);
    return response.data;
  },

  patchDemographic: async (processId: string, formData: any): Promise<DemographicResponse> => {
    const payload = demographicService.mapFormDataToBackend(formData);
    const response = await api.patch<DemographicResponse>(`/demographics/${processId}`, payload);
    return response.data;
  },

  mapFormDataToBackend: (data: any) => {
    return {
      applicantCategory: data.category || 'CAT1',
      nationalIdNumber: data.nidNo || null,
      identity: {
        firstName: data.firstNameEn || null,
        middleName: data.middleNameEn || null,
        lastName: data.lastNameEn || null,
        firstNameNp: data.firstNameNp || null,
        middleNameNp: data.middleNameNp || null,
        lastNameNp: data.lastNameNp || null,
        dateOfBirth: data.dobEn || null,
        dateOfBirthNp: data.dobNp || null,
        citizenshipNo: data.citizenshipNo || null,
        birthDistrict: data.birthPlace || null,
        ccType: data.ccType || null,
        issuedDistrict: data.district || null,
        issuedDate: data.issuedDate || null,
      },
      additionalInfo: {
        gender: data.gender || null,
        maritalStatus: data.maritalStatus || null,
        religion: data.religion || null,
        caste: data.caste || null,
        education: data.education || null,
        business: data.business || null,
        rescueLocation: data.rescueLocation || null,
        currentHoldingCenter: data.currentHoldingCenter || null,
      },
      permanentAddress: {
        phone: data.permPhone || null,
        mobile: data.permMobile || null,
        state: data.permState || null,
        district: data.permDistrict || null,
        localLevel: data.permLocalLevel || null,
        ward: data.permWard || null,
        villageToleNp: data.permVillageNp || null,
        villageToleEn: data.permVillageEn || null,
      },
      temporaryAddress: {
        phone: data.tempPhone || null,
        mobile: data.tempMobile || null,
        state: data.tempState || null,
        district: data.tempDistrict || null,
        localLevel: data.tempLocalLevel || null,
        ward: data.tempWard || null,
        villageToleNp: data.tempVillageNp || null,
        villageToleEn: data.tempVillageEn || null,
      },
      family: {
        father: {
          firstName: data.fatherFirstNameEn || null,
          lastName: data.fatherLastNameEn || null,
          citizenshipNo: data.fatherCitizenshipNo || null,
          nidNo: data.fatherNidNo || null,
          nationality: data.fatherNationality || null,
        },
        mother: {
          firstName: data.motherFirstNameEn || null,
          lastName: data.motherLastNameEn || null,
          citizenshipNo: data.motherCitizenshipNo || null,
          nidNo: data.motherNidNo || null,
          nationality: data.motherNationality || null,
        },
        grandFather: {
          firstName: data.grandFatherFirstNameEn || null,
          lastName: data.grandFatherLastNameEn || null,
          citizenshipNo: data.grandFatherCitizenshipNo || null,
          nidNo: data.grandFatherNidNo || null,
          nationality: data.grandFatherNationality || null,
        },
        grandMother: {
          firstName: data.grandMotherFirstNameEn || null,
          lastName: data.grandMotherLastNameEn || null,
          citizenshipNo: data.grandMotherCitizenshipNo || null,
          nidNo: data.grandMotherNidNo || null,
          nationality: data.grandMotherNationality || null,
        },
        spouse: {
          firstName: data.spouseFirstNameEn || null,
          lastName: data.spouseLastNameEn || null,
          citizenshipNo: data.spouseCitizenshipNo || null,
          nidNo: data.spouseNidNo || null,
          nationality: data.spouseNationality || null,
        }
      },
      familyMembers: data.familyMembers || [],
      landOwnership: {
        hasLand: data.hasLandNepal || null,
        ownerName: data.landOwnerName || null,
        relation: data.landRelationToHead || null,
        location: data.landLocation || null,
        area: data.landArea || null,
        isUsable: data.isLandUsable || null,
        noOwnershipReason: data.landNoOwnershipReason || null,
        solutionOption: data.landSolutionOption || null,
      },
      housing: {
        hasHouse: data.hasHouse || null,
        houseType: data.houseType || null,
        solutionOption: data.housingSolutionOption || null,
        requiredHousingForm: data.requiredHousingForm || null,
      },
      economicStatus: {
        mainIncomeSource: data.mainIncomeSource || null,
        totalMonthlyIncome: data.monthlyIncome || null,
        hasSavings: data.hasSavings || null,
        savingsDetails: data.savingsDetails || null,
        economicEmpowermentOptions: data.empowermentOption ? [data.empowermentOption] : [],
      },
      healthStatus: {
        hasChronicIllness: data.hasChronicIllness || null,
        chronicIllnessDetails: data.chronicIllnessDetails || [],
      },
      familySpecificDetails: {
        pregnantCount: data.pregnantCount ? parseInt(data.pregnantCount) : 0,
        nursingCount: data.nursingCount ? parseInt(data.nursingCount) : 0,
        childrenUnder5: {
          boy: data.childrenUnder5Boy ? parseInt(data.childrenUnder5Boy) : 0,
          girl: data.childrenUnder5Girl ? parseInt(data.childrenUnder5Girl) : 0,
        },
        children5to16: {
          boy: data.children5to16Boy ? parseInt(data.children5to16Boy) : 0,
          girl: data.children5to16Girl ? parseInt(data.children5to16Girl) : 0,
        },
        seniors65Plus: {
          male: data.seniors65PlusMale ? parseInt(data.seniors65PlusMale) : 0,
          female: data.seniors65PlusFemale ? parseInt(data.seniors65PlusFemale) : 0,
        },
        disability: {
          male: data.disabilityMale ? parseInt(data.disabilityMale) : 0,
          female: data.disabilityFemale ? parseInt(data.disabilityFemale) : 0,
        }
      },
      biometric: {
        applicantPhoto: data.applicantPhoto || null,
      }
    };
  }
};
