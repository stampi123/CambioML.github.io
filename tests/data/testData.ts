type TestFile = {
  name: string;
  maskPIIOutput: string;
  noMaskPIIOutput: string;
};

const TEST_FILE_PATH = 'tests/data/';

export const testFileData: TestFile[] = [
  {
    name: `${TEST_FILE_PATH}SamplePortfolioStatement.pdf`,
    maskPIIOutput: `CambioML
INVESTMENT REPORT
July 1 - July 31, 2015
Your Portfolio Value: $274,222.20
Change from Last Period: $21,000.37
Envelope # BABCEJBPPRTLA
[NAME_1]
[ADDRESS_1]
Beginning Portfolio ValueThis Period $253,221.83Year-to-Date $232,643.16Additions59,269.64121,433.55Subtractions-45,430.74-98,912.58Transaction Costs, Fees & Charges-139.77-625.87Change in Investment Value*7,161.4719,058.07Ending Portfolio Value**$274,222.20$274,222.20

Appreciation or depreciation of your holdings due to price changes plus any distribution and income earned during the statement period.
** Excludes unpriced securities.

Your account numbers can be found on page 2 in the Accounts Included in this Report section. Your statement also has a new look and more information. We hope you find the changes beneficial and we look forward to hearing your feedback.
1 of 28`,
    noMaskPIIOutput: `CambioML
INVESTMENT REPORT
July 1 - July 31, 2015
Your Portfolio Value: $274,222.20
Change from Last Period: $21,000.37
Envelope # BABCEJBPPRTLA
John W. Doe
100 Main St.
Boston, MA 02201
Beginning Portfolio ValueThis Period $253,221.83Year-to-Date $232,643.16Additions59,269.64121,433.55Subtractions-45,430.74-98,912.58Transaction Costs, Fees & Charges-139.77-625.87Change in Investment Value*7,161.4719,058.07Ending Portfolio Value**$274,222.20$274,222.20

Appreciation or depreciation of your holdings due to price changes plus any distribution and income earned during the statement period.
** Excludes unpriced securities.

Your account numbers can be found on page 2 in the Accounts Included in this Report section. Your statement also has a new look and more information. We hope you find the changes beneficial and we look forward to hearing your feedback.
1 of 28`,
  },
];
