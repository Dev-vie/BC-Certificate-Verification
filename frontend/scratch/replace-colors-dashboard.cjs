const fs = require('fs');
const path = require('path');

const files = [
  'pages/dashboardPage.tsx',
  'components/DashboardPage/header.tsx',
  'components/DashboardPage/sidebar.tsx'
];

const dir = 'd:\\Semester 6\\BC Certificate Verification\\frontend\\src';

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace [#3D876C] with primary
  content = content.replace(/\[#3D876C\]/g, 'primary');
  content = content.replace(/#3D876C/g, 'var(--primary)');
  
  // Replace [#2C6450] with primary-hover
  content = content.replace(/\[#2C6450\]/g, 'primary-hover');
  
  // Replace emerald classes
  content = content.replace(/emerald-500/g, 'primary');
  content = content.replace(/emerald-400/g, 'primary-light');
  content = content.replace(/emerald-700/g, 'primary-hover');
  content = content.replace(/emerald-100/g, 'primary-lighter');
  content = content.replace(/emerald-50/g, 'primary-lighter');
  content = content.replace(/emerald-200/g, 'primary-light');
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});
