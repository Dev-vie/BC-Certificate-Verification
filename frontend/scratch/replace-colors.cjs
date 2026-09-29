const fs = require('fs');
const path = require('path');

const files = [
  'TemplateSummaryCard.tsx',
  'TemplatePickerModal.tsx',
  'IssueHowItWorksModal.tsx',
  'fileupload.tsx',
  'CertificatePreviewCard.tsx',
  'CertificateIssueForm.tsx',
  'BlockchainStatusCard.tsx',
  'ModeToggle.tsx',
  '../../pages/issueCerficatePage.tsx'
];

const dir = 'd:\\Semester 6\\BC Certificate Verification\\frontend\\src\\components\\issue-certificate';

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace [#3D876C] with primary (for tailwind classes like text-[#3D876C] -> text-primary)
  content = content.replace(/\[#3D876C\]/g, 'primary');
  // Just in case there are standalone #3D876C not in brackets (like inline styles or stroke)
  content = content.replace(/#3D876C/g, 'var(--primary)');
  
  // Replace [#2C6450] with primary-hover
  content = content.replace(/\[#2C6450\]/g, 'primary-hover');
  
  // Replace emerald classes
  content = content.replace(/emerald-500/g, 'primary');
  content = content.replace(/emerald-400/g, 'primary-light');
  content = content.replace(/emerald-700/g, 'primary-hover');
  content = content.replace(/emerald-100/g, 'primary-lighter');
  content = content.replace(/emerald-50/g, 'primary-lighter'); // emerald-50 often used as very light background
  content = content.replace(/emerald-200/g, 'primary-light'); // emerald-200 often used as light border
  
  // specifically fix "from-emerald-500 to-teal-700" to "from-primary to-primary-hover"
  content = content.replace(/to-teal-700/g, 'to-primary-hover');
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});
