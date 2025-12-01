
// const ExcelJS = require('exceljs');
// const path = require('path');
// const fs = require('fs');

// async function generateLeadTemplate() {
//   const workbook = new ExcelJS.Workbook();
//   const sheet = workbook.addWorksheet('Leads Template');

//   // Columns:  A        B            C        D        E         F        G
//   sheet.columns = [
//     { header: 'name',        key: 'name',        width: 25 },
//     { header: 'phoneNumber', key: 'phoneNumber', width: 20, style: { numFmt: '@' } }, // text
//     { header: 'address',     key: 'address',     width: 20 },
//     { header: 'budget',      key: 'budget',      width: 15 },
//     { header: 'propertyType',  key: 'propertyType',  width: 20 },
//     { header: 'flatType',    key: 'flatType',    width: 15 },
//     { header: 'areaKey',     key: 'areaKey',     width: 25 },
//     { header: 'remark',      key: 'remark',      width: 30 },
//   ];

//   // Make sure header row is bold
//   const headerRow = sheet.getRow(1);
//   headerRow.font = { bold: true };

//   // Ensure phoneNumber column is text
//   sheet.getColumn('phoneNumber').numFmt = '@';

//   // Dropdown options
//   const flatTypes = ['1RK', '1BHK', '2BHK', '3BHK', '4BHK', 'Villa', 'Penthouse'];

//     const propertyTypes = [
//     'Standalone house',
//     'Apartment',
//     'Gated community',
//     'Independent house',
//     'Villa',
//     'PG / Co-living',
//     'Plot / Land',
//   ];

//   const budgetOptions = [
//     '0-10000',
//     '10000-20000',
//     '20000-30000',
//     '30000-50000',
//     '50000-75000',
//     '75000-100000',
//     '100000-above',
//   ];

//   const areaOptions = [
//     'Whitefield', 'Indiranagar', 'Koramangala', 'Bengaluru', 'Jayanagar',
//     'Banashankari', 'Basaveshwaranagar', 'Bheemanahalli', 'Bommanahalli',
//     'Chikkalasandra', 'Dasarahalli', 'Domlur', 'Electronic City', 'Frazer Town',
//     'Girinagar', 'Gokula', 'Gopalapuram', 'Hanumanthanagar', 'HBR Layout',
//     'Hebbal', 'Hoysala', 'HSR Layout', 'Ittamadu', 'JP Nagar', 'Jyothinagar',
//     'Kammanahalli', 'Kaval Byrasandra', 'Kodichikkanahalli', 'Kommadi',
//     'Kundalahalli', 'Lingrajapuram', 'Mahadevapura', 'Malleswaram',
//     'Marathahalli', 'Mathikere', 'Mico Layout', 'Mookambika', 'Nagavara',
//     'Nagawara', 'Nagarathpet', 'Nandini Layout', 'Nayandahalli',
//     'Old Airport Road', 'Peenya', 'Prithviraj Road', 'RMV Extension',
//     'Sadashivnagar', 'Sahakarnagar', 'Sanjaynagar', 'Sarjapur Road',
//     'Seshadripuram', 'Shantinagar', 'Shivaji Nagar', 'Soladevanahalli',
//     'Subramanyanagar',
//   ];

//   // Apply dropdowns to a range of rows (2 to 5000) in specific columns:
//   // flatType -> column E, budget -> column D, areaKey -> column F
//   sheet.dataValidations.add('E2:E5000', {
//     type: 'list',
//     allowBlank: true,
//     formulae: [`"${flatTypes.join(',')}"`],
//   });

//   sheet.dataValidations.add('D2:D5000', {
//     type: 'list',
//     allowBlank: true,
//     formulae: [`"${budgetOptions.join(',')}"`],
//   });

//   sheet.dataValidations.add('F2:F5000', {
//     type: 'list',
//     allowBlank: true,
//     formulae: [`"${areaOptions.join(',')}"`],
//   });

//   const publicDir = path.join(__dirname, '..', 'public');
//   if (!fs.existsSync(publicDir)) {
//     fs.mkdirSync(publicDir);
//   }

//   const filePath = path.join(publicDir, 'lead-bulk-template.xlsx');
//   await workbook.xlsx.writeFile(filePath);

//   console.log('Excel Template generated:', filePath);
// }

// generateLeadTemplate();


const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function generateLeadTemplate() {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Leads Template');

  // Columns:  A        B            C        D         E             F         G        H
  sheet.columns = [
    { header: 'name',          key: 'name',          width: 25 },
    { header: 'phoneNumber',   key: 'phoneNumber',   width: 20, style: { numFmt: '@' } }, // text
    { header: 'address',       key: 'address',       width: 20 },
    { header: 'budget',        key: 'budget',        width: 15 },
    { header: 'propertyType',  key: 'propertyType',  width: 20 },  // NEW
    { header: 'flatType',      key: 'flatType',      width: 15 },
    { header: 'areaKey',       key: 'areaKey',       width: 25 },
    { header: 'remark',        key: 'remark',        width: 30 },
  ];

  // Make sure header row is bold
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true };

  // Ensure phoneNumber column is text
  sheet.getColumn('phoneNumber').numFmt = '@';

  // Dropdown options
  const flatTypes = ['1RK', '1BHK', '2BHK', '3BHK', '4BHK', 'Villa', 'Penthouse'];

  const propertyTypes = [
    'Standalone house',
    'Apartment',
    'Gated community',
    'Independent house',
    'Villa',
    'PG / Co-living',
    'Plot / Land',
  ];

  const budgetOptions = [
    '0-10000',
    '10000-20000',
    '20000-30000',
    '30000-50000',
    '50000-75000',
    '75000-100000',
    '100000-above',
  ];

  const areaOptions = [
    'Whitefield', 'Indiranagar', 'Koramangala', 'Bengaluru', 'Jayanagar',
    'Banashankari', 'Basaveshwaranagar', 'Bheemanahalli', 'Bommanahalli',
    'Chikkalasandra', 'Dasarahalli', 'Domlur', 'Electronic City', 'Frazer Town',
    'Girinagar', 'Gokula', 'Gopalapuram', 'Hanumanthanagar', 'HBR Layout',
    'Hebbal', 'Hoysala', 'HSR Layout', 'Ittamadu', 'JP Nagar', 'Jyothinagar',
    'Kammanahalli', 'Kaval Byrasandra', 'Kodichikkanahalli', 'Kommadi',
    'Kundalahalli', 'Lingrajapuram', 'Mahadevapura', 'Malleswaram',
    'Marathahalli', 'Mathikere', 'Mico Layout', 'Mookambika', 'Nagavara',
    'Nagawara', 'Nagarathpet', 'Nandini Layout', 'Nayandahalli',
    'Old Airport Road', 'Peenya', 'Prithviraj Road', 'RMV Extension',
    'Sadashivnagar', 'Sahakarnagar', 'Sanjaynagar', 'Sarjapur Road',
    'Seshadripuram', 'Shantinagar', 'Shivaji Nagar', 'Soladevanahalli',
    'Subramanyanagar',
  ];

  // Apply dropdowns to a range of rows (2 to 5000):
  // budget       -> column D
  // propertyType -> column E
  // flatType     -> column F
  // areaKey      -> column G

  sheet.dataValidations.add('D2:D5000', {
    type: 'list',
    allowBlank: true,
    formulae: [`"${budgetOptions.join(',')}"`],
  });

  sheet.dataValidations.add('E2:E5000', {
    type: 'list',
    allowBlank: true,
    formulae: [`"${propertyTypes.join(',')}"`],
  });

  sheet.dataValidations.add('F2:F5000', {
    type: 'list',
    allowBlank: true,
    formulae: [`"${flatTypes.join(',')}"`],
  });

  sheet.dataValidations.add('G2:G5000', {
    type: 'list',
    allowBlank: true,
    formulae: [`"${areaOptions.join(',')}"`],
  });

  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  const filePath = path.join(publicDir, 'lead-bulk-template.xlsx');
  await workbook.xlsx.writeFile(filePath);

  console.log('Excel Template generated:', filePath);
}

generateLeadTemplate();
