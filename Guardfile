guard 'haml', :output => 'www', :input => 'src/haml', :bare => true do
  watch %r{^src/haml/(.*/)?([^/]+)(\.html\.haml)$}
end

guard :sass, :output => 'www/css', :input => 'src/sass', :bare => true do
  watch %r{^src/sass/(.*/)?([^/]+)\.sass$}
end

guard :coffeescript, :output => 'www/js', :input => 'src/coffee', :bare => true do
  watch %r{^src/coffee/(.*/)?([^/]+)\.coffee$}
end