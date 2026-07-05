import React, { useState } from 'react';
import './App.css';

interface Landlord {
  name: string;
  phone: string;
  address: string;
}

interface Tenant {
  name: string;
  phone: string;
  occupation: string;
}

interface ContractData {
  landlord: Landlord;
  tenant: Tenant;
  contract_type: 'jeonse' | 'monthly';
  deposit: number;
  monthly_rent: number;
  start_date: string;
  end_date: string;
  special_clauses?: string;
  format: 'docx' | 'pdf' | 'hwp';
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [step, setStep] = useState<'form' | 'preview' | 'complete'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFileName, setDownloadFileName] = useState<string | null>(null);

  const [formData, setFormData] = useState<ContractData>({
    landlord: { name: '', phone: '', address: '' },
    tenant: { name: '', phone: '', occupation: '' },
    contract_type: 'jeonse',
    deposit: 0,
    monthly_rent: 0,
    start_date: '',
    end_date: '',
    special_clauses: '',
    format: 'docx',
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const keys = field.split('.');
      if (keys.length === 2) {
        return {
          ...prev,
          [keys[0]]: { ...prev[keys[0] as keyof ContractData], [keys[1]]: value }
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleGenerateContract = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/generate-contract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '계약서 생성 실패');
      }

      const data = await response.json();
      setDownloadUrl(`${API_URL}${data.download_url}`);
      setDownloadFileName(data.filename);
      setStep('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류 발생');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return formData.landlord.name && 
           formData.tenant.name && 
           formData.start_date && 
           formData.end_date &&
           formData.deposit > 0;
  };

  const handleReset = () => {
    setStep('form');
    setDownloadUrl(null);
    setDownloadFileName(null);
    setError(null);
    setFormData({
      landlord: { name: '', phone: '', address: '' },
      tenant: { name: '', phone: '', occupation: '' },
      contract_type: 'jeonse',
      deposit: 0,
      monthly_rent: 0,
      start_date: '',
      end_date: '',
      special_clauses: '',
      format: 'docx',
    });
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🏠 임대차계약서 자동 생성기</h1>
        <p>직거래할 때 필요한 계약서를 빠르게 만들어보세요</p>
      </header>

      <main className="container">
        {step === 'form' && (
          <form className="form">
            <section className="section">
              <h2>📋 임대인(집주인) 정보</h2>
              <div className="form-group">
                <label>이름 <span className="required">*</span></label>
                <input
                  type="text"
                  value={formData.landlord.name}
                  onChange={(e) => handleInputChange('landlord.name', e.target.value)}
                  placeholder="홍길동"
                  required
                />
              </div>
              <div className="form-group">
                <label>전화번호</label>
                <input
                  type="tel"
                  value={formData.landlord.phone}
                  onChange={(e) => handleInputChange('landlord.phone', e.target.value)}
                  placeholder="010-1234-5678"
                />
              </div>
              <div className="form-group">
                <label>주소 <span className="required">*</span></label>
                <input
                  type="text"
                  value={formData.landlord.address}
                  onChange={(e) => handleInputChange('landlord.address', e.target.value)}
                  placeholder="서울시 강남구 테헤란로 123"
                  required
                />
              </div>
            </section>

            <section className="section">
              <h2>👤 임차인(세입자) 정보</h2>
              <div className="form-group">
                <label>이름 <span className="required">*</span></label>
                <input
                  type="text"
                  value={formData.tenant.name}
                  onChange={(e) => handleInputChange('tenant.name', e.target.value)}
                  placeholder="김영희"
                  required
                />
              </div>
              <div className="form-group">
                <label>전화번호</label>
                <input
                  type="tel"
                  value={formData.tenant.phone}
                  onChange={(e) => handleInputChange('tenant.phone', e.target.value)}
                  placeholder="010-9876-5432"
                />
              </div>
              <div className="form-group">
                <label>직업</label>
                <input
                  type="text"
                  value={formData.tenant.occupation}
                  onChange={(e) => handleInputChange('tenant.occupation', e.target.value)}
                  placeholder="회사원"
                />
              </div>
            </section>

            <section className="section">
              <h2>💰 계약 조건</h2>
              <div className="form-group">
                <label>계약 유형 <span className="required">*</span></label>
                <select
                  value={formData.contract_type}
                  onChange={(e) => handleInputChange('contract_type', e.target.value)}
                  required
                >
                  <option value="jeonse">전세</option>
                  <option value="monthly">월세</option>
                </select>
              </div>

              <div className="form-group">
                <label>보증금 (원) <span className="required">*</span></label>
                <input
                  type="number"
                  value={formData.deposit}
                  onChange={(e) => handleInputChange('deposit', parseInt(e.target.value) || 0)}
                  placeholder="30000000"
                  required
                />
              </div>

              {formData.contract_type === 'monthly' && (
                <div className="form-group">
                  <label>월세 (원)</label>
                  <input
                    type="number"
                    value={formData.monthly_rent}
                    onChange={(e) => handleInputChange('monthly_rent', parseInt(e.target.value) || 0)}
                    placeholder="500000"
                  />
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>계약 시작일 <span className="required">*</span></label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>계약 종료일 <span className="required">*</span></label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => handleInputChange('end_date', e.target.value)}
                    required
                  />
                </div>
              </div>
            </section>

            <section className="section">
              <h2>📝 특약사항 (선택)</h2>
              <div className="form-group">
                <textarea
                  value={formData.special_clauses}
                  onChange={(e) => handleInputChange('special_clauses', e.target.value)}
                  placeholder="예: 수도료, 가스료는 임차인 부담. 관리비는 월 50,000원..."
                  rows={4}
                />
              </div>
            </section>

            <section className="section">
              <h2>📥 다운로드 형식</h2>
              <div className="format-selector">
                <label>
                  <input
                    type="radio"
                    name="format"
                    value="docx"
                    checked={formData.format === 'docx'}
                    onChange={(e) => handleInputChange('format', e.target.value)}
                  />
                  <span>Word (.docx) - 현재 지원 ✓</span>
                </label>
                <label disabled>
                  <input
                    type="radio"
                    name="format"
                    value="hwp"
                    disabled
                  />
                  <span>한글 (.hwp) - 개발 중</span>
                </label>
                <label disabled>
                  <input
                    type="radio"
                    name="format"
                    value="pdf"
                    disabled
                  />
                  <span>PDF (.pdf) - 개발 중</span>
                </label>
              </div>
            </section>

            {error && <div className="error-message">❌ {error}</div>}

            <button
              type="button"
              className="btn-primary"
              onClick={handleGenerateContract}
              disabled={loading || !isFormValid()}
            >
              {loading ? '⏳ 생성 중...' : '✨ 계약서 생성하기'}
            </button>

            <p className="info-text">
              ℹ️ 반드시 법적 검토 후 사용하세요. 이 서비스는 참고용입니다.
            </p>
          </form>
        )}

        {step === 'complete' && downloadUrl && (
          <div className="success-message">
            <h2>✅ 계약서가 생성되었습니다!</h2>
            <p>아래 버튼을 클릭하여 다운로드하세요.</p>
            <div className="button-group">
              <a href={downloadUrl} download={downloadFileName} className="btn-primary">
                📥 계약서 다운로드
              </a>
              <button
                className="btn-secondary"
                onClick={handleReset}
              >
                🔄 새 계약서 생성
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>© 2026 임대차계약서 자동 생성기 | 대법원 표준 양식 기반</p>
        <p>⚠️ 법적 검토 후 사용하세요 | <a href="https://github.com/garyrhee/lease-contract-generator" target="_blank">GitHub</a></p>
      </footer>
    </div>
  );
}

export default App;
