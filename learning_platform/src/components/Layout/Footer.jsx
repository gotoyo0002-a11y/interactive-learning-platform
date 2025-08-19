import { Link } from 'react-router-dom'
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">互動式教學平台</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              提供優質的線上學習體驗，讓學習變得更加有趣和高效。
              我們致力於為學習者和教育者創造最佳的互動學習環境。
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">support@learning-platform.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">快速連結</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/courses" className="text-gray-300 hover:text-white transition-colors">
                  瀏覽課程
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  關於我們
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  聯絡我們
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-300 hover:text-white transition-colors">
                  幫助中心
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">支援</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors">
                  常見問題
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  隱私政策
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                  服務條款
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="text-gray-300 hover:text-white transition-colors">
                  意見回饋
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 互動式教學平台. 版權所有.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                隱私政策
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                服務條款
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie 政策
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

