import React from 'react';
import { useApp } from '../context/AppContext';

const Blog: React.FC = () => {
  const { blogPosts } = useApp();
  return (
    <section id="blog" className="py-20 bg-slate-900/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Blog</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-600 mx-auto rounded-full"></div>
          <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
            Read my latest articles, tutorials, and thoughts on technology, coding, and more.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.length === 0 ? (
            <p className="text-gray-400 col-span-full">No blog posts yet.</p>
          ) : (
            blogPosts.map(post => (
              <div key={post.id} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg">
                {post.imageUrl && (
                  <img src={post.imageUrl} alt="Blog" className="w-full h-48 object-cover rounded mb-2" />
                )}
                {post.videoUrl && (
                  <video src={post.videoUrl} controls className="w-full h-48 rounded mb-2" />
                )}
                <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
                <p className="text-gray-400 mb-4 line-clamp-3">{post.content}</p>
                <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                  <span>{post.author}</span>
                  <span>{post.date.toLocaleDateString()}</span>
                </div>
                {post.externalUrl ? (
                  <a href={post.externalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-semibold">Read More ↗</a>
                ) : (
                  <a href="https://medium.com/@Kavishka2002" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-semibold">Read More ↗</a>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Blog;
