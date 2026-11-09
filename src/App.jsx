import { supabase } from './supabaseClient';
import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';

function App() {
  const [isEntered, setIsEntered] = useState(() => {
    return localStorage.getItem('chs_is_entered') === 'true';
  });

  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (isEntered) {
      localStorage.setItem('chs_is_entered', 'true');
    } else {
      localStorage.removeItem('chs_is_entered');
    }
  }, [isEntered]);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    const { data, error } = await supabase
      .from('schedule_events')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('일정 불러오기 실패:', error);
    } else if (data) {
      setEvents(data);
    }
  };

  const inspections = events.map(ev => ({
    id: ev.id,
    vendor: ev.vendor || '',
    project: ev.block || '',
    shipNo: ev.hull_no || '',
    tkNo: ev.TK_NO || ev.tk_no || '',
    item: ev.item || '',
    date: ev.date || '',
  }));

  const handleAddEvent = async (newEventData) => {
    const { error } = await supabase
      .from('schedule_events')
      .insert([{
        date: newEventData.date,
        vendor: newEventData.vendor,
        hull_no: newEventData.shipNo,
        block: newEventData.project,
        TK_NO: newEventData.tkNo,
        item: newEventData.item,
        time: '',
      }]);

    if (error) {
      console.error('DB 저장 에러:', error);
      alert('저장 실패: ' + error.message);
    } else {
      await fetchSchedules();
    }
  };

  const handleUpdateEvent = async (id, updatedData) => {
    const { error } = await supabase
      .from('schedule_events')
      .update({
        date: updatedData.date,
        vendor: updatedData.vendor,
        hull_no: updatedData.shipNo,
        block: updatedData.project,
        TK_NO: updatedData.tkNo,
        item: updatedData.item,
      })
      .eq('id', id);

    if (error) {
      console.error('DB 수정 에러:', error);
      alert('수정 실패: ' + error.message);
    } else {
      await fetchSchedules();
    }
  };

  const handleDeleteEvent = async (id) => {
    const { error } = await supabase
      .from('schedule_events')
      .delete()
      .eq('id', id);

    if (error) {
      alert('삭제 실패: ' + error.message);
    } else {
      await fetchSchedules();
    }
  };

  const [currentTab, setCurrentTab] = useState('register');
  const [selectedVendor, setSelectedVendor] = useState('전체');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('전체');
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const [activeVendor, setActiveVendor] = useState('');
  const [editId, setEditId] = useState(null);
  const [project, setProject] = useState('');
  const [shipNo, setShipNo] = useState('');
  const [tkNo, setTkNo] = useState('TK1');
  const [item, setItem] = useState('');
  
  const getTodayStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [date, setDate] = useState(getTodayStr());

  const getThisWeekMonday = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const [currentWeekStart, setCurrentWeekStart] = useState(getThisWeekMonday());

  const vendors = [
    'DONGWON INDUSTRY', 'KANGNAM MACHINE INDUSTRY', 'SWIC', 
    'HSG PEARL SHELL', 'HSG HEAVY INDUSTRY', 'KUMKWANG HEAVY INDUSTRY', 'DOWOO INDUSTRY'
  ];
  
  const vendorStyles = {
    'DONGWON INDUSTRY': { bg: '#e0f2fe', border: '#0284c7', text: '#0369a1', excelBg: '#E0F2FE' },
    'KANGNAM MACHINE INDUSTRY': { bg: '#ecfdf5', border: '#059669', text: '#047857', excelBg: '#ECFDF5' },
    'SWIC': { bg: '#fef3c7', border: '#d97706', text: '#b45309', excelBg: '#FEF3C7' },
    'HSG PEARL SHELL': { bg: '#f3e8ff', border: '#9333ea', text: '#7e22ce', excelBg: '#F3E8FF' },
    'HSG HEAVY INDUSTRY': { bg: '#fae8ff', border: '#c084fc', text: '#a855f7', excelBg: '#FAE8FF' },
    'KUMKWANG HEAVY INDUSTRY': { bg: '#fee2e2', border: '#dc2626', text: '#b91c1c', excelBg: '#FEE2E2' },
    'DOWOO INDUSTRY': { bg: '#ccfbf1', border: '#0d9488', text: '#0f766e', excelBg: '#CCFBF1' },
  };

  const projects = [
    'NAKILAT', 'NYK', 'EVALEND', 'CMA CGM', 'RELIANCE', 'DYNAGAS', 'MOL', 
    'NYK VLAC', 'PRUS MARINE', 'RELIANCE SOLVANG', 'YANG MING ONE', 'PANTHEON', 'PRIMAVERA'
  ];

  const shipNumbers = [
    '3398', '3399', '3400', '3401', '3441', '3442', '3443', '3444', '3446', '3447', 
    '3448', '3449', '3454', '3455', '3456', '3457', '3459', '3460', '3462', '3463', 
    '3476', '3477', '3478', '3479', '3480', '3481', '3482', '3483', '3484', '3485', 
    '3486', '3487', '3488', '3489', '3490', '3491', '3492', '3493', '3494', '3495', 
    '3496', '3497', '3498', '3499', '3500', '3501', '3502', '3507', '3508', '3514', 
    '3515', '3525', '3526', '3527', '3528', '3529', '3530', '3542', '3543', '3556', 
    '3557', '3558', '3559', '3560', '3561', '3562', '3563', '3564', '3565', '3566', '3567'
  ];

  const tkOptions = ['TK1', 'TK2', 'TK3', 'TK4'];

  const items = [
    'Liquid dome cover',
    'Gas dome',
    'Gas dome internal',
    'Liquid dome coaming',
    'Pump tower base plate',
    'Pump tower base support',
    'Helium Leak test',
    'Sump well',
    'Sump well block',
    'Liquid dome cover insulation',
    'PTBS insulation',
    'Sump well insulation'
  ];

  const getWeekDays = (startDate) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      days.push({ dayName: dayNames[i], dateStr, dayNum: d.getDate(), isWeekend: i >= 5 });
    }
    return days;
  };

  const weekDays = getWeekDays(currentWeekStart);

  const handlePrevWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const weekRangeText = `${weekDays[0].dateStr.slice(5).replace('-', '/')} ~ ${weekDays[6].dateStr.slice(5).replace('-', '/')}`;

  // 엑셀 다운로드 셀 텍스트 순서 변경: 호선 / 아이템 / TK 넘버 순서
  const handleExcelDownload = () => {
    const activeProjects = ['All Projects', ...new Set(inspections.map(i => i.project))];
    let workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <?mso-application progid="Excel.Sheet"?>
      <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
        xmlns:o="urn:schemas-microsoft-com:office:office"
        xmlns:x="urn:schemas-microsoft-com:office:excel"
        xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
        xmlns:html="http://www.w3.org/TR/REC-html40">
      <Styles>
        <Style ss:ID="TitleStyle">
          <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
          <Interior ss:Color="#E2EFDA" ss:Pattern="Solid"/>
          <Font ss:FontName="Arial" ss:Size="16" ss:Bold="1" ss:Color="#006100"/>
        </Style>
        <Style ss:ID="SubTitleStyle">
          <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
          <Font ss:FontName="Arial" ss:Size="10" ss:Color="#333333"/>
        </Style>
        <Style ss:ID="HeaderStyle">
          <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
          <Interior ss:Color="#1B4332" ss:Pattern="Solid"/>
          <Font ss:FontName="Arial" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
        </Style>
        <Style ss:ID="WeekendHeaderStyle">
          <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
          <Interior ss:Color="#6E2C22" ss:Pattern="Solid"/>
          <Font ss:FontName="Arial" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
        </Style>
        <Style ss:ID="VendorStyle">
          <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
          <Font ss:FontName="Arial" ss:Size="10" ss:Bold="1" ss:Color="#1B4332"/>
        </Style>
        <Style ss:ID="EmptyDataStyle">
          <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
          <Font ss:FontName="Arial" ss:Size="9" ss:Color="#333333"/>
        </Style>`;

    vendors.forEach(v => {
      const hexColor = vendorStyles[v]?.excelBg || '#E0F2FE';
      const safeKey = v.replace(/[^a-zA-Z0-9]/g, '_');
      workbookXml += `
        <Style ss:ID="DataStyle_${safeKey}">
          <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
          <Interior ss:Color="${hexColor}" ss:Pattern="Solid"/>
          <Font ss:FontName="Arial" ss:Size="9" ss:Bold="1" ss:Color="#111827"/>
        </Style>`;
    });

    workbookXml += `</Styles>`;

    activeProjects.forEach(proj => {
      const targetVendors = proj === 'All Projects'
        ? vendors
        : vendors.filter(v => inspections.some(ins => ins.project === proj && ins.vendor === v));

      workbookXml += `
      <Worksheet ss:Name="${proj}">
        <Table ss:DefaultColumnWidth="120" ss:DefaultRowHeight="20">
          <Column ss:Width="180"/>
          ${weekDays.map(() => '<Column ss:Width="160"/>').join('')}
          <Row ss:Height="35">
            <Cell ss:MergeAcross="7" ss:StyleID="TitleStyle"><Data ss:Type="String">Weekly Inspection Schedule — ${proj}</Data></Cell>
          </Row>
          <Row ss:Height="22">
            <Cell ss:MergeAcross="7" ss:StyleID="SubTitleStyle"><Data ss:Type="String">Weekly Schedule   ${weekRangeText}</Data></Cell>
          </Row>
          <Row ss:Height="28">
            <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Subcontractor</Data></Cell>`;

      weekDays.forEach((w, idx) => {
        const styleId = idx >= 5 ? "WeekendHeaderStyle" : "HeaderStyle";
        workbookXml += `<Cell ss:StyleID="${styleId}"><Data ss:Type="String">${w.dayName} ${w.dayNum}</Data></Cell>`;
      });

      workbookXml += `</Row>`;

      targetVendors.forEach(vendor => {
        workbookXml += `
          <Row ss:Height="75">
            <Cell ss:StyleID="VendorStyle"><Data ss:Type="String">${vendor}</Data></Cell>`;

        weekDays.forEach(w => {
          const matches = inspections.filter(ins => {
            const matchProj = proj === 'All Projects' || ins.project === proj;
            return ins.vendor === vendor && ins.date === w.dateStr && matchProj;
          });

          if (matches.length > 0) {
            // 호선 / 아이템 / TK 넘버 순서로 조합
            const cellText = matches.map(m => `${m.shipNo} ${m.item} ${m.tkNo ? `(TK No.: ${m.tkNo})` : ''}`).join('\n');
            const safeKey = vendor.replace(/[^a-zA-Z0-9]/g, '_');
            workbookXml += `<Cell ss:StyleID="DataStyle_${safeKey}"><Data ss:Type="String">${cellText}</Data></Cell>`;
          } else {
            workbookXml += `<Cell ss:StyleID="EmptyDataStyle"><Data ss:Type="String"></Data></Cell>`;
          }
        });
        workbookXml += `</Row>`;
      });

      workbookXml += `</Table></Worksheet>`;
    });

    workbookXml += `</Workbook>`;

    const blob = new Blob([workbookXml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Weekly_Inspection_Schedule.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePdfDownload = () => {
    const printElement = document.getElementById('print-target-area');
    if (!printElement) {
      alert('출력할 캘린더 영역을 찾을 수 없습니다.');
      return;
    }

    html2canvas(printElement, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const win = window.open('', '_blank');
      win.document.write(`
        <html>
          <head>
            <title>Weekly Inspection Schedule - PDF</title>
            <style>body { font-family: 'Segoe UI', sans-serif; margin: 20px; text-align: center; } img { max-width: 100%; height: auto; }</style>
          </head>
          <body>
            <h2 style="color: #1b4332;">Weekly Inspection Schedule</h2>
            <img src="${imgData}" />
            <script>setTimeout(() => { window.print(); window.close(); }, 500);</script>
          </body>
        </html>
      `);
      win.document.close();
    });
  };

  const handleVendorConfirm = () => {
    if (!activeVendor) {
      alert('협력사를 선택해 주세요.');
      return;
    }
    setShowVendorModal(false);
    setDate(getTodayStr());
    setTkNo('TK1');
    setShowRegisterModal(true);
  };

  const handleCardClick = (itemData) => {
    if (!activeVendor) {
      setActiveVendor(itemData.vendor);
    } else if (activeVendor !== itemData.vendor) {
      alert('본인 협력사 데이터만 수정할 수 있습니다.');
      return;
    }
    setEditId(itemData.id);
    setProject(itemData.project);
    setShipNo(itemData.shipNo);
    setTkNo(itemData.tkNo || 'TK1');
    setItem(itemData.item);
    setDate(itemData.date);
    setShowEditModal(true);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!project || !shipNo || !item || !date) {
      alert('모든 필수 항목을 입력해 주세요.');
      return;
    }

    await handleAddEvent({
      date,
      vendor: activeVendor,
      shipNo,
      project,
      tkNo,
      item,
    });

    setShowRegisterModal(false);
    setProject(''); 
    setShipNo(''); 
    setTkNo('TK1');
    setItem('');
    alert('검사 일정이 성공적으로 등록되었습니다!');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await handleUpdateEvent(editId, {
      date,
      vendor: activeVendor,
      shipNo,
      project,
      tkNo,
      item,
    });
    setShowEditModal(false);
    alert('검사 일정이 수정되었습니다.');
  };

  const handleDelete = async (itemData) => {
    if (activeVendor && activeVendor !== itemData.vendor) {
      alert('본인 협력사 데이터만 삭제할 수 있습니다.');
      return;
    }
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await handleDeleteEvent(itemData.id);
    }
  };

  if (!isEntered) {
    return (
      <div style={styles.landingContainer}>
        <div style={styles.contentBox}>
          <h1 style={styles.hdLogo}>HD</h1>
          <p style={styles.subText}>HYUNDAI HEAVY INDUSTRIES</p>
          <p style={styles.description}>
            여기는 현대중공업 CHS 아이템 검사 일정<br />
            관리를 위한 공간입니다
          </p>
          <button style={styles.enterButton} onClick={() => setIsEntered(true)}>
            입장하기
          </button>
          <footer style={styles.footer}>
            CHS Quality Inspection Schedule System<br />
            <span style={{ fontSize: '0.75rem', opacity: 0.6, display: 'inline-block', marginTop: '4px' }}>
              Developed by EJ.Lee
            </span>
          </footer>
        </div>
      </div>
    );
  }

  const currentWeekDateStrs = weekDays.map(w => w.dateStr);
  const filteredInspections = selectedVendor === '전체' ? inspections : inspections.filter((ins) => ins.vendor === selectedVendor);
  const weekInspections = filteredInspections.filter(ins => currentWeekDateStrs.includes(ins.date));
  const adminFilteredInspections = selectedProjectFilter === '전체' ? inspections.filter(ins => currentWeekDateStrs.includes(ins.date)) : inspections.filter(ins => currentWeekDateStrs.includes(ins.date) && ins.project === selectedProjectFilter);
  const progressBaseInspections = adminFilteredInspections;

  return (
    <div style={styles.mainLayout}>
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.sidebarLogoBox}>
            <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800' }}>HD</h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.7rem', color: '#a8c3b2', letterSpacing: '1px' }}>
              현대중공업 CHS 검사 일정 관리
            </p>
          </div>
          <nav style={styles.navMenu}>
            <div 
              style={{ ...styles.navItem, backgroundColor: currentTab === 'register' ? 'rgba(255, 255, 255, 0.15)' : 'transparent', fontWeight: currentTab === 'register' ? 'bold' : 'normal' }}
              onClick={() => setCurrentTab('register')}
            >
              📋 검사 등록/조회
            </div>
            <div 
              style={{ ...styles.navItem, backgroundColor: currentTab === 'admin' ? 'rgba(255, 255, 255, 0.15)' : 'transparent', fontWeight: currentTab === 'admin' ? 'bold' : 'normal' }}
              onClick={() => setCurrentTab('admin')}
            >
              📊 관리자 현황판
            </div>
            <div style={styles.navItem}>⚙️ 등록 정보 관리</div>
          </nav>
        </div>
        
        <div style={styles.sidebarSummary}>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '8px' }}>이번 주 요약</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#e5e7eb' }}>전체</span>
              <strong style={{ fontSize: '1.05rem', color: '#ffffff' }}>{weekInspections.length}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#e5e7eb' }}>협력사</span>
              <strong style={{ fontSize: '1.05rem', color: '#ffffff' }}>{vendors.length}</strong>
            </div>
          </div>
        </div>
      </aside>

      <main style={styles.contentArea}>
        {currentTab === 'register' ? (
          <>
            <header style={styles.topHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>📅</span>
                <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#222' }}>검사 등록/조회</h2>
              </div>
              <div>
                <button style={styles.primaryBtn} onClick={() => setShowVendorModal(true)}>+ 검사 등록</button>
              </div>
            </header>

            <div style={styles.bodyGrid}>
              <div style={{ ...styles.vendorPanel, width: '240px', padding: '14px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', color: '#1b4332', borderBottom: '2px solid #1b4332', paddingBottom: '6px' }}>협력사 선택</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '550px', overflowY: 'auto' }}>
                  <li 
                    style={{ 
                      fontSize: '0.85rem', cursor: 'pointer', padding: '6px 8px', borderRadius: '4px',
                      backgroundColor: selectedVendor === '전체' ? '#f0fdf4' : 'transparent',
                      fontWeight: selectedVendor === '전체' ? 'bold' : 'normal', 
                      color: selectedVendor === '전체' ? '#1b4332' : '#4b5563' 
                    }}
                    onClick={() => setSelectedVendor('전체')}
                  >
                    전체
                  </li>
                  {vendors.map((v) => {
                    const isSelected = selectedVendor === v;
                    const dotColor = vendorStyles[v]?.border || '#1b4332';
                    return (
                      <li 
                        key={v} 
                        style={{ 
                          fontSize: '0.8rem', cursor: 'pointer', padding: '6px 8px', borderRadius: '4px',
                          backgroundColor: isSelected ? '#f0fdf4' : 'transparent',
                          fontWeight: isSelected ? 'bold' : 'normal', 
                          color: isSelected ? '#1b4332' : '#4b5563',
                          display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                        onClick={() => setSelectedVendor(v)}
                      >
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: dotColor, display: 'inline-block', flexShrink: 0 }}></span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={styles.noticeBar}>
                  <span style={{ fontWeight: 'bold', color: '#b91c1c' }}>📢 공지사항</span>
                  <span style={{ marginLeft: '12px', color: '#374151' }}>프로그램 일부 업데이트 공지 드립니다. 문의사항은 언제든지 연락주세요.</span>
                </div>

                <div style={styles.calendarCard}>
                  <div style={styles.weekHeader}>
                    <button style={styles.arrowBtn} onClick={handlePrevWeek}>&lt;</button>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>📅 {weekRangeText}</span>
                    <button style={styles.arrowBtn} onClick={handleNextWeek}>&gt;</button>
                    <span style={{ fontSize: '0.9rem', color: '#6b7280', marginLeft: '12px' }}>{weekInspections.length}건</span>
                  </div>

                  <div style={styles.calendarGrid}>
                    {weekDays.map((w) => {
                      const dayItems = filteredInspections.filter((ins) => ins.date === w.dateStr);
                      return (
                        <div key={w.dateStr} style={styles.dayColumn}>
                          <div style={styles.dayHeader}>
                            <span style={{ color: w.isWeekend ? '#dc2626' : '#374151', fontWeight: 'bold' }}>{w.dayName}</span>
                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: w.isWeekend ? '#dc2626' : '#111' }}>{w.dayNum}</span>
                            <span style={{ fontSize: '0.75rem', color: '#059669' }}>{dayItems.length}건</span>
                          </div>
                          
                          <div style={styles.dayBody}>
                            {dayItems.map((itemData) => {
                              const vStyle = vendorStyles[itemData.vendor] || { bg: '#eef2ff', border: '#1b4332', text: '#1b4332' };
                              return (
                                <div 
                                  key={itemData.id} 
                                  style={{ ...styles.inspectionCard, backgroundColor: vStyle.bg, borderLeft: `4px solid ${vStyle.border}` }}
                                  onClick={() => handleCardClick(itemData)}
                                >
                                  <div style={{ ...styles.cardVendor, color: vStyle.text }}>{itemData.vendor}</div>
                                  <div style={styles.cardDetail}>[{itemData.project}] {itemData.shipNo} {itemData.tkNo && `(TK No.: ${itemData.tkNo})`}</div>
                                  <div style={styles.cardItemName}>{itemData.item}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 목록 테이블 */}
                <div style={styles.listCard}>
                  <div style={styles.listHeaderTitle}>이번 주 검사 목록</div>
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.thRow}>
                        <th style={{ ...styles.th, width: '18%' }}>협력사</th>
                        <th style={{ ...styles.th, width: '13%' }}>프로젝트</th>
                        <th style={{ ...styles.th, width: '12%' }}>호선</th>
                        <th style={{ ...styles.th, width: '14%' }}>TK No.</th>
                        <th style={{ ...styles.th, width: '23%' }}>아이템</th>
                        <th style={{ ...styles.th, width: '12%' }}>날짜</th>
                        <th style={{ ...styles.th, width: '8%' }}>관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weekInspections.length === 0 ? (
                        <tr><td colSpan="7" style={{ ...styles.td, textAlign: 'center', color: '#9ca3af', padding: '24px' }}>이번 주에 등록된 검사 일정이 없습니다.</td></tr>
                      ) : (
                        weekInspections.map((itemData) => {
                          const vStyle = vendorStyles[itemData.vendor] || { text: '#1b4332' };
                          return (
                            <tr key={itemData.id} style={styles.tr}>
                              <td style={{ ...styles.td, fontWeight: 'bold', color: vStyle.text }}>{itemData.vendor}</td>
                              <td style={styles.td}>{itemData.project}</td>
                              <td style={styles.td}>{itemData.shipNo}</td>
                              <td style={{ ...styles.td, fontWeight: '600', color: '#0369a1' }}>{itemData.tkNo || '-'}</td>
                              <td style={styles.td}>{itemData.item}</td>
                              <td style={styles.td}>{itemData.date}</td>
                              <td style={styles.td}>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                  <button style={styles.tableEditBtn} onClick={() => handleCardClick(itemData)}>수정</button>
                                  <button style={styles.tableDeleteBtn} onClick={() => handleDelete(itemData)}>삭제</button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <header style={styles.topHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>📊</span>
                <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#222' }}>관리자 현황판</h2>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={styles.excelBtn} onClick={handleExcelDownload}>📊 엑셀</button>
                <button style={styles.pdfBtn} onClick={handlePdfDownload}>📄 PDF</button>
              </div>
            </header>

            <div style={styles.bodyGrid}>
              <div style={{ ...styles.vendorPanel, width: '220px', padding: '14px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', color: '#1b4332', borderBottom: '2px solid #1b4332', paddingBottom: '6px' }}>프로젝트 필터</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '550px', overflowY: 'auto' }}>
                  <li 
                    style={{ 
                      fontSize: '0.85rem', cursor: 'pointer', padding: '6px 8px', borderRadius: '4px',
                      backgroundColor: selectedProjectFilter === '전체' ? '#f0fdf4' : 'transparent',
                      fontWeight: selectedProjectFilter === '전체' ? 'bold' : 'normal', 
                      color: selectedProjectFilter === '전체' ? '#1b4332' : '#555' 
                    }}
                    onClick={() => setSelectedProjectFilter('전체')}
                  >
                    전체
                  </li>
                  {projects.map((p) => {
                    const isSelected = selectedProjectFilter === p;
                    return (
                      <li 
                        key={p} 
                        style={{ 
                          fontSize: '0.83rem', cursor: 'pointer', padding: '6px 8px', borderRadius: '4px',
                          backgroundColor: isSelected ? '#f0fdf4' : 'transparent',
                          fontWeight: isSelected ? 'bold' : 'normal', 
                          color: isSelected ? '#1b4332' : '#555' 
                        }}
                        onClick={() => setSelectedProjectFilter(p)}
                      >
                        {p}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={styles.adminStatsRow}>
                  <div style={styles.statCard}>
                    <div style={styles.statNumber}>{adminFilteredInspections.length}</div>
                    <div style={styles.statLabel}>이번주 전체</div>
                  </div>
                  <div style={styles.statCard}>
                    <div style={{ ...styles.statNumber, color: '#0284c7' }}>{vendors.length}</div>
                    <div style={styles.statLabel}>등록 협력사</div>
                  </div>
                </div>

                <div style={styles.progressCard}>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: '#1b4332', fontWeight: 'bold' }}>협력사별 등록 현황</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {vendors.map(v => {
                      const count = progressBaseInspections.filter(i => i.vendor === v).length;
                      const maxCount = Math.max(...vendors.map(vendor => progressBaseInspections.filter(i => i.vendor === vendor).length), 1);
                      const percent = count > 0 ? (count / maxCount) * 100 : 0;
                      const brandColor = vendorStyles[v]?.border || '#1b4332';

                      return (
                        <div key={v} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#1f2937' }}>{v}</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: count > 0 ? '#1b4332' : '#9ca3af' }}>{count}건</span>
                          </div>
                          <div style={{ width: '100%', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${percent}%`, backgroundColor: brandColor, borderRadius: '3px', transition: 'width 0.4s ease-in-out' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div id="print-target-area" style={styles.calendarCard}>
                  <div style={styles.weekHeader}>
                    <button style={styles.arrowBtn} onClick={handlePrevWeek}>&lt;</button>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>📅 {weekRangeText}</span>
                    <button style={styles.arrowBtn} onClick={handleNextWeek}>&gt;</button>
                    <span style={{ fontSize: '0.9rem', color: '#6b7280', marginLeft: '12px' }}>{adminFilteredInspections.length}건</span>
                  </div>

                  <div style={styles.calendarGrid}>
                    {weekDays.map((w) => {
                      const dayItems = adminFilteredInspections.filter((ins) => ins.date === w.dateStr);
                      return (
                        <div key={w.dateStr} style={styles.dayColumn}>
                          <div style={styles.dayHeader}>
                            <span style={{ color: w.isWeekend ? '#dc2626' : '#374151', fontWeight: 'bold' }}>{w.dayName}</span>
                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: w.isWeekend ? '#dc2626' : '#111' }}>{w.dayNum}</span>
                            <span style={{ fontSize: '0.75rem', color: '#059669' }}>{dayItems.length}건</span>
                          </div>
                          
                          <div style={styles.dayBody}>
                            {dayItems.map((itemData) => {
                              const vStyle = vendorStyles[itemData.vendor] || { bg: '#eef2ff', border: '#1b4332', text: '#1b4332' };
                              return (
                                <div 
                                  key={itemData.id} 
                                  style={{ ...styles.inspectionCard, backgroundColor: vStyle.bg, borderLeft: `4px solid ${vStyle.border}` }}
                                  onClick={() => handleCardClick(itemData)}
                                >
                                  <div style={{ ...styles.cardVendor, color: vStyle.text }}>{itemData.vendor}</div>
                                  <div style={styles.cardDetail}>[{itemData.project}] {itemData.shipNo} {itemData.tkNo && `(TK No.: ${itemData.tkNo})`}</div>
                                  <div style={styles.cardItemName}>{itemData.item}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {showVendorModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>🔒 협력사 확인</h3>
              <button onClick={() => setShowVendorModal(false)} style={styles.closeBtn}>✕</button>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#666', margin: '12px 0 16px 0' }}>세션 중 처음이거나 협력사가 변경된 경우 한 번만 확인합니다.</p>
            <div style={{ marginBottom: '20px' }}>
              <label style={styles.labelStyle}>사용할 협력사:</label>
              <select value={activeVendor} onChange={(e) => setActiveVendor(e.target.value)} style={styles.selectInput}>
                <option value="">-- 선택하세요 --</option>
                {vendors.map((v) => (<option key={v} value={v}>{v}</option>))}
              </select>
            </div>
            <div style={styles.modalFooter}>
              <button onClick={() => setShowVendorModal(false)} style={styles.cancelBtn}>취소</button>
              <button onClick={handleVendorConfirm} style={styles.submitBtn}>✓ 확인</button>
            </div>
          </div>
        </div>
      )}

      {/* 등록 모달 */}
      {showRegisterModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>검사 등록</h3>
              <button onClick={() => setShowRegisterModal(false)} style={styles.closeBtn}>✕</button>
            </div>
            <form onSubmit={handleRegisterSubmit} style={{ marginTop: '16px' }}>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: '#666' }}>협력사: </span>
                <strong style={{ fontSize: '0.95rem', color: '#1b4332' }}>{activeVendor}</strong>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={styles.labelStyle}>프로젝트 (선사)</label>
                <select value={project} onChange={(e) => setProject(e.target.value)} style={styles.selectInput} required>
                  <option value="">-- 선택 --</option>
                  {projects.map((p) => (<option key={p} value={p}>{p}</option>))}
                </select>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={styles.labelStyle}>호선번호</label>
                <select value={shipNo} onChange={(e) => setShipNo(e.target.value)} style={styles.selectInput} required>
                  <option value="">-- 선택 --</option>
                  {shipNumbers.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={styles.labelStyle}>TK No.</label>
                <select value={tkNo} onChange={(e) => setTkNo(e.target.value)} style={styles.selectInput} required>
                  {tkOptions.map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={styles.labelStyle}>아이템 (검사 항목)</label>
                <select value={item} onChange={(e) => setItem(e.target.value)} style={styles.selectInput} required>
                  <option value="">-- 선택 --</option>
                  {items.map((i) => (<option key={i} value={i}>{i}</option>))}
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={styles.labelStyle}>날짜 <span style={{ color: 'red' }}>*</span></label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={styles.selectInput} required />
              </div>
              <div style={styles.modalFooter}>
                <button type="button" onClick={() => setShowRegisterModal(false)} style={styles.cancelBtn}>취소</button>
                <button type="submit" style={styles.submitBtn}>등록</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 수정 모달 */}
      {showEditModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>검사 수정</h3>
              <button onClick={() => setShowEditModal(false)} style={styles.closeBtn}>✕</button>
            </div>
            <form onSubmit={handleEditSubmit} style={{ marginTop: '16px' }}>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: '#666' }}>협력사: </span>
                <strong style={{ fontSize: '0.95rem', color: '#1b4332' }}>{activeVendor}</strong>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={styles.labelStyle}>프로젝트 (선사)</label>
                <select value={project} onChange={(e) => setProject(e.target.value)} style={styles.selectInput} required>
                  <option value="">-- 선택 --</option>
                  {projects.map((p) => (<option key={p} value={p}>{p}</option>))}
                </select>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={styles.labelStyle}>호선번호</label>
                <select value={shipNo} onChange={(e) => setShipNo(e.target.value)} style={styles.selectInput} required>
                  <option value="">-- 선택 --</option>
                  {shipNumbers.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={styles.labelStyle}>TK No.</label>
                <select value={tkNo} onChange={(e) => setTkNo(e.target.value)} style={styles.selectInput} required>
                  {tkOptions.map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={styles.labelStyle}>아이템 (검사 항목)</label>
                <select value={item} onChange={(e) => setItem(e.target.value)} style={styles.selectInput} required>
                  <option value="">-- 선택 --</option>
                  {items.map((i) => (<option key={i} value={i}>{i}</option>))}
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={styles.labelStyle}>날짜 <span style={{ color: 'red' }}>*</span></label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={styles.selectInput} required />
              </div>
              <div style={styles.modalFooter}>
                <button type="button" onClick={() => setShowEditModal(false)} style={styles.cancelBtn}>취소</button>
                <button type="submit" style={styles.submitBtn}>수정 완료</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  landingContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100vh', background: 'radial-gradient(circle at center, #234e38 0%, #122b1e 100%)', color: '#ffffff', fontFamily: "'Segoe UI', Roboto, sans-serif", textAlign: 'center' },
  contentBox: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  hdLogo: { fontSize: '4.8rem', fontWeight: '800', letterSpacing: '2px', margin: 0, lineHeight: '1' },
  subText: { fontSize: '0.8rem', letterSpacing: '3.5px', color: '#a8c3b2', marginTop: '12px', marginBottom: '28px', fontWeight: '600' },
  description: { fontSize: '1.05rem', lineHeight: '1.65', color: '#e0e7e2', margin: '0 0 32px 0' },
  enterButton: { padding: '11px 40px', fontSize: '1rem', fontWeight: '500', color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.12)', border: '1px solid rgba(255, 255, 255, 0.35)', borderRadius: '4px', cursor: 'pointer' },
  footer: { marginTop: '48px', fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.45)' },

  mainLayout: { display: 'flex', width: '100vw', height: '100vh', backgroundColor: '#f3f4f6', fontFamily: "'Segoe UI', Roboto, sans-serif" },
  sidebar: { width: '240px', backgroundColor: '#1b4332', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px 16px' },
  sidebarLogoBox: { borderBottom: '1px solid rgba(255, 255, 255, 0.15)', paddingBottom: '16px' },
  navMenu: { marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' },
  navItem: { padding: '10px 12px', borderRadius: '6px', fontSize: '0.9rem', cursor: 'pointer', color: '#e2e8e4' },
  sidebarSummary: { backgroundColor: 'rgba(0, 0, 0, 0.2)', padding: '12px 14px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)' },

  contentArea: { flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', overflowY: 'auto' },
  topHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '16px 20px', borderRadius: '8px', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  primaryBtn: { backgroundColor: '#1b4332', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95rem' },
  excelBtn: { backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' },
  pdfBtn: { backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' },

  bodyGrid: { display: 'flex', gap: '16px', flex: 1 },
  vendorPanel: { width: '200px', backgroundColor: '#fff', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', height: 'fit-content' },

  adminStatsRow: { display: 'flex', gap: '16px' },
  statCard: { backgroundColor: '#fff', borderRadius: '8px', padding: '16px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statNumber: { fontSize: '1.8rem', fontWeight: 'bold', color: '#1b4332' },
  statLabel: { fontSize: '0.85rem', color: '#6b7280', marginTop: '4px' },

  progressCard: { backgroundColor: '#fff', borderRadius: '8px', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  noticeBar: { backgroundColor: '#fffbe8', border: '1px solid #fef3c7', padding: '12px 16px', borderRadius: '8px', fontSize: '0.88rem' },
  calendarCard: { backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', minHeight: '380px' },
  weekHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' },
  arrowBtn: { border: '1px solid #d1d5db', backgroundColor: '#fff', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer' },

  calendarGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', flex: 1, border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' },
  dayColumn: { backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column', borderRight: '1px solid #e5e7eb' },
  dayHeader: { padding: '8px', backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' },
  dayBody: { padding: '6px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' },

  inspectionCard: { borderRadius: '4px', padding: '6px 8px', fontSize: '0.8rem', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
  cardVendor: { fontWeight: 'bold', fontSize: '0.75rem' },
  cardDetail: { color: '#4b5563', fontSize: '0.75rem', marginTop: '2px' },
  cardItemName: { color: '#1f2937', fontWeight: 'bold', marginTop: '2px' },

  listCard: { backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginTop: '8px' },
  listHeaderTitle: { fontSize: '0.95rem', fontWeight: 'bold', color: '#374151', marginBottom: '14px' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' },
  thRow: { borderBottom: '2px solid #1b4332', backgroundColor: '#f9fafb' },
  th: { padding: '10px 12px', color: '#374151', fontWeight: '600' },
  tr: { borderBottom: '1px solid #f3f4f6' },
  td: { padding: '10px 12px', color: '#4b5563' },
  tableEditBtn: { border: '1px solid #6366f1', color: '#4f46e5', backgroundColor: '#f5f3ff', borderRadius: '4px', padding: '3px 8px', fontSize: '0.75rem', cursor: 'pointer' },
  tableDeleteBtn: { border: '1px solid #fca5a5', color: '#dc2626', backgroundColor: '#fef2f2', borderRadius: '4px', padding: '3px 8px', fontSize: '0.75rem', cursor: 'pointer' },

  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalCard: { backgroundColor: '#fff', width: '380px', borderRadius: '8px', padding: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px' },
  closeBtn: { background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#666' },
  labelStyle: { display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px', color: '#374151' },
  selectInput: { width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' },
  modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' },
  cancelBtn: { padding: '8px 16px', border: 'none', backgroundColor: '#f3f4f6', color: '#4b5563', borderRadius: '6px', cursor: 'pointer' },
  submitBtn: { padding: '8px 18px', border: 'none', backgroundColor: '#1b4332', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
};

export default App;