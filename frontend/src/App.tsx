import React, { useState } from 'react';
import './App.css';

interface PersonInfo {
  name: string;
  phone: string;
  address: string;
  idNumber: string;
}

interface ContractData {
  landlord: PersonInfo;
  tenant: PersonInfo;
  contractType: 'jeonse' | 'monthly';
  property: {
    address: string;
    area: string;
    type: string;
  };
  lease: {
    startDate: string;
    endDate: string;
    deposit: string;
    rent: string;
  };
  terms: string;
}

const initialFormData: ContractData = {
  landlord: { name: '', phone: '', address: '', idNumber: '' },
  tenant: { name: '', phone: '', address: '', idNumber: '' },
  contractType: 'monthly',
  property: { address: '', area: '', type: '' },
  lease: { startDate: '', endDate: '', deposit: '', rent: '' },
  terms: '',
};

export default function App() {
  const [formData, setFormData] = useState<ContractData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setError(null);
    const keys = field.split('.');
    
    setFormData(prev => {
      if (keys.length === 2) {
        const [section, key] = keys;
        return {
          ...prev,
          [section]: {
            ...(prev[section as keyof ContractData] as Record<string, string>),
            [key]: value
          }
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleGenerateContract = async () => {
    // Validation
    if (!formData.landlord.name || !formData.tenant.name) {
      setError('임차인과 임대인 정보를 입력해주세요.');
      return;
    }
    if (!formData.property.address) {
      setError('부동산 주소를 입력해주세요.');
      return;
    }
    if (!formData.lease.startDate || !formData.lease.endDate) {
      setError('계약 기간을 설정해주세요.');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const response = await fetch(`${apiUrl}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lease_contract_${Date.now()}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Contract generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setError(null);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📄 임대차계약서 생성기</h1>
        <p>표준 한국 임대차계약서를 자동으로 생성하세요</p>
      </header>

      <main className="form-container">
        {error && <div className="error-message">{error}</div>}

        {/* Landlord Section */}
        <section className="form-section">
          <h2>임대인 정보</h2>
          <div className="form-group">
            <label htmlFor="landlord-name">이름 *</label>
            <input
              id="landlord-name"
              type="text"
              value={formData.landlord.name}
              onChange={(e) => handleInputChange('landlord.name', e.target.value)}
              placeholder="홍길동"
            />
          </div>
          <div className="form-group">
            <label htmlFor="landlord-phone">전화번호</label>
            <input
              id="landlord-phone"
              type="tel"
              value={formData.landlord.phone}
              onChange={(e) => handleInputChange('landlord.phone', e.target.value)}
              placeholder="010-1234-5678"
            />
          </div>
          <div className="form-group">
            <label htmlFor="landlord-address">주소</label>
            <input
              id="landlord-address"
              type="text"
              value={formData.landlord.address}
              onChange={(e) => handleInputChange('landlord.address', e.target.value)}
              placeholder="서울시 강남구..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="landlord-id">주민등록번호 (선택)</label>
            <input
              id="landlord-id"
              type="text"
              value={formData.landlord.idNumber}
              onChange={(e) => handleInputChange('landlord.idNumber', e.target.value)}
              placeholder="000000-0000000"
            />
          </div>
        </section>

        {/* Tenant Section */}
        <section className="form-section">
          <h2>임차인 정보</h2>
          <div className="form-group">
            <label htmlFor="tenant-name">이름 *</label>
            <input
              id="tenant-name"
              type="text"
              value={formData.tenant.name}
              onChange={(e) => handleInputChange('tenant.name', e.target.value)}
              placeholder="김영희"
            />
          </div>
          <div className="form-group">
            <label htmlFor="tenant-phone">전화번호</label>
            <input
              id="tenant-phone"
              type="tel"
              value={formData.tenant.phone}
              onChange={(e) => handleInputChange('tenant.phone', e.target.value)}
              placeholder="010-9876-5432"
            />
          </div>
          <div className="form-group">
            <label htmlFor="tenant-address">주소</label>
            <input
              id="tenant-address"
              type="text"
              value={formData.tenant.address}
              onChange={(e) => handleInputChange('tenant.address', e.target.value)}
              placeholder="서울시 마포구..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="tenant-id">주민등록번호 (선택)</label>
            <input
              id="tenant-id"
              type="text"
              value={formData.tenant.idNumber}
              onChange={(e) => handleInputChange('tenant.idNumber', e.target.value)}
              placeholder="000000-0000000"
            />
          </div>
        </section>

        {/* Contract Type & Property */}
        <section className="form-section">
          <h2>계약 유형 및 부동산</h2>
          <div className="form-group">
            <label htmlFor="contract-type">계약 유형 *</label>
            <select
              id="contract-type"
              value={formData.contractType}
              onChange={(e) => handleInputChange('contractType', e.target.value)}
            >
              <option value="monthly">월세</option>
              <option value="jeonse">전세</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="property-address">부동산 주소 *</label>
            <input
              id="property-address"
              type="text"
              value={formData.property.address}
              onChange={(e) => handleInputChange('property.address', e.target.value)}
              placeholder="서울시 강남구 테헤란로 123"
            />
          </div>
          <div className="form-group">
            <label htmlFor="property-type">부동산 유형</label>
            <input
              id="property-type"
              type="text"
              value={formData.property.type}
              onChange={(e) => handleInputChange('property.type', e.target.value)}
              placeholder="아파트, 원룸, 오피스텔 등"
            />
          </div>
          <div className="form-group">
            <label htmlFor="property-area">면적 (평)</label>
            <input
              id="property-area"
              type="text"
              value={formData.property.area}
              onChange={(e) => handleInputChange('property.area', e.target.value)}
              placeholder="33"
            />
          </div>
        </section>

        {/* Lease Terms */}
        <section className="form-section">
          <h2>계약 조건</h2>
          <div className="form-group">
            <label htmlFor="lease-start">시작 날짜 *</label>
            <input
              id="lease-start"
              type="date"
              value={formData.lease.startDate}
              onChange={(e) => handleInputChange('lease.startDate', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lease-end">종료 날짜 *</label>
            <input
              id="lease-end"
              type="date"
              value={formData.lease.endDate}
              onChange={(e) => handleInputChange('lease.endDate', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lease-deposit">
              {formData.contractType === 'monthly' ? '보증금' : '전세금'} (만원)
            </label>
            <input
              id="lease-deposit"
              type="number"
              value={formData.lease.deposit}
              onChange={(e) => handleInputChange('lease.deposit', e.target.value)}
              placeholder="1000"
            />
          </div>
          {formData.contractType === 'monthly' && (
            <div className="form-group">
              <label htmlFor="lease-rent">월세 (만원)</label>
              <input
                id="lease-rent"
                type="number"
                value={formData.lease.rent}
                onChange={(e) => handleInputChange('lease.rent', e.target.value)}
                placeholder="50"
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="lease-terms">추가 조건 (선택)</label>
            <textarea
              id="lease-terms"
              value={formData.terms}
              onChange={(e) => handleInputChange('terms', e.target.value)}
              placeholder="특약사항 등 추가 조건을 입력하세요..."
              rows={4}
            />
          </div>
        </section>

        {/* Action Buttons */}
        <section className="action-buttons">
          <button
            className="btn btn-primary"
            onClick={handleGenerateContract}
            disabled={loading}
          >
            {loading ? '생성 중...' : '📥 계약서 생성 (DOCX)'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={loading}
          >
            초기화
          </button>
        </section>

        <footer className="form-footer">
          <p>⚠️ 이 계약서는 참고용입니다. 실제 계약 시 전문가와 상담하세요.</p>
          <p>Generated with ⚡ Rheeman</p>
        </footer>
      </main>
    </div>
  );
}
