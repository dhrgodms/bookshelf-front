// 인증 관련 유틸리티 함수들
const APP_NAME = import.meta.env.VITE_APP_NAME || 'bookshelf'
const ENV = import.meta.env.VITE_ENV || 'development'
const TOKEN_PREFIX = `${APP_NAME}_${ENV}_`

// 토큰 저장
export const setTokens = (accessToken, refreshToken) => {
    if (accessToken) {
        localStorage.setItem(`${TOKEN_PREFIX}access`, accessToken)
    }
    if (refreshToken) {
        localStorage.setItem(`${TOKEN_PREFIX}refresh`, refreshToken)
    }
}

// 토큰 가져오기
export const getAccessToken = () => {
    return localStorage.getItem(`${TOKEN_PREFIX}access`)
}

export const getRefreshToken = () => {
    return localStorage.getItem(`${TOKEN_PREFIX}refresh`)
}

// 토큰 삭제
export const removeTokens = () => {
    localStorage.removeItem(`${TOKEN_PREFIX}access`)
    localStorage.removeItem(`${TOKEN_PREFIX}refresh`)
}

// 로그인 상태 확인 (토큰 존재 여부만 체크)
export const isTokenExists = () => {
    return !!getAccessToken()
}

// 토큰 유효성 검증 (선택적 - 서버에 요청을 보내서 토큰이 유효한지 확인)
export const validateToken = async () => {
    const token = getAccessToken()
    if (!token) return false

    try {
        // 서버에 토큰 유효성 확인 요청
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/validate`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        return response.ok
    } catch (error) {
        console.error('Token validation error:', error)
        return false
    }
}

// JWT 토큰 디코딩 (클라이언트 사이드에서 만료 시간 확인)
export const decodeToken = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]))
    } catch (error) {
        console.error('Token decode error:', error)
        return null
    }
}

// 토큰 만료 시간 확인
export const isTokenExpired = (token) => {
    if (!token) return true

    const decoded = decodeToken(token)
    if (!decoded) return true

    const currentTime = Math.floor(Date.now() / 1000)
    return decoded.exp < currentTime
}
