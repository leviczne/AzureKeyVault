using Azure.Extensions.AspNetCore.Configuration.Secrets;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System;

namespace Renova.Vistoria.Sistema
{
   
    public class Program
    {
        public static string secret;

        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }
       
        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((context, config) =>
                {
                    
                    var builtConfiguration = config.Build();

                    string kvURL = builtConfiguration["KeyVaultConfig:KVUrl"];
                    string tenantId = builtConfiguration["KeyVaultConfig:TenantId"];
                    string clientId = builtConfiguration["KeyVaultConfig:ClientId"];
                    string clientSecret = builtConfiguration["KeyVaultConfig:ClientSecretId"];

                    var credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

                    var client = new SecretClient(new Uri(kvURL), credential);
                    config.AddAzureKeyVault(client, new AzureKeyVaultConfigurationOptions());
                    secret = client.GetSecret("ConnectionStringDatabase").Value.Value;


                })
                .ConfigureWebHostDefaults(webBuilder =>
                {

                    webBuilder.UseStartup<Startup>();
                });

    }
}
